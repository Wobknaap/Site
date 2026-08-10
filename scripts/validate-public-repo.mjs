import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "docs", "node_modules"]);
const forbiddenRoots = new Set([".openai", ".vinext", "private", "drafts"]);
const forbiddenExtensions = new Set([".key", ".pem", ".p12", ".pfx"]);
const textExtensions = new Set(["", ".css", ".gitignore", ".js", ".json", ".md", ".mjs", ".svg", ".ts", ".tsx", ".yaml", ".yml"]);
const forbiddenPatterns = [
  [/appgprj_[a-z0-9]+/i, "intern Sites-projectnummer"],
  [/oaiapp_[a-z0-9]+/i, "interne app-identificatie"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "privésleutel"],
  [/github_pat_[A-Za-z0-9_]+/, "GitHub-token"],
  [/ghp_[A-Za-z0-9]+/, "GitHub-token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS-sleutel"],
];

const files = [];
async function walk(directory, relative = "") {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const nextRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      if (forbiddenRoots.has(nextRelative.replaceAll("\\", "/"))) {
        throw new Error(`Verboden map in openbare repository: ${nextRelative}`);
      }
      await walk(path.join(directory, entry.name), nextRelative);
      continue;
    }
    files.push(nextRelative);
  }
}

await walk(root);

for (const file of files) {
  const normalized = file.replaceAll("\\", "/");
  const basename = path.basename(file);
  const extension = path.extname(file).toLowerCase();
  if (basename.startsWith(".env") || forbiddenExtensions.has(extension) || /(?:^|\/)(?:private|drafts)(?:\/|$)/i.test(normalized)) {
    throw new Error(`Verboden privébestand in openbare repository: ${normalized}`);
  }
  if (!textExtensions.has(extension) && !["README.md", ".npmrc"].includes(basename)) continue;
  const value = await readFile(path.join(root, file), "utf8");
  for (const [pattern, label] of forbiddenPatterns) {
    if (pattern.test(value)) throw new Error(`${label} gevonden in ${normalized}`);
  }
}

await import("./validate-public-content.mjs");
console.log(`${files.length} repositorybestanden gecontroleerd op privégegevens en geheimen.`);
