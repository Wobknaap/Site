import { readFile } from "node:fs/promises";
import path from "node:path";

const contentPath = path.join(process.cwd(), "app/content-data.json");
const content = JSON.parse(await readFile(contentPath, "utf8"));

function fail(message) {
  throw new Error(`Openbare content ongeldig: ${message}`);
}

if (!Array.isArray(content.articles) || !Array.isArray(content.notes)) {
  fail("articles en notes moeten lijsten zijn");
}

const slugs = new Set();
for (const article of content.articles) {
  if (article.status !== "published" && article.status !== "external") {
    fail(`${article.slug || "artikel zonder slug"} heeft status ${article.status}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug || "")) {
    fail(`ongeldige slug: ${article.slug || "leeg"}`);
  }
  if (slugs.has(article.slug)) fail(`dubbele slug: ${article.slug}`);
  slugs.add(article.slug);
  if (!String(article.title || "").trim() || !String(article.excerpt || "").trim()) {
    fail(`${article.slug} mist een titel of omschrijving`);
  }
  if (article.status === "published" && !String(article.body || "").trim()) {
    fail(`${article.slug} mist artikeltekst`);
  }
  if (String(article.editorialNote || "").trim()) {
    fail(`${article.slug} bevat een redactienotitie`);
  }
  if (article.status === "external") {
    let sourceUrl;
    try {
      sourceUrl = new URL(article.sourceUrl);
    } catch {
      fail(`${article.slug} heeft geen geldige bronlink`);
    }
    if (sourceUrl.protocol !== "https:") fail(`${article.slug} gebruikt geen HTTPS-bronlink`);
  }
  if (article.coverImage && (!article.coverImage.startsWith("/images/") || article.coverImage.includes(".."))) {
    fail(`${article.slug} heeft een onveilig afbeeldingspad`);
  }
}

const noteIds = new Set();
for (const note of content.notes) {
  if (!String(note.id || "").trim() || !String(note.date || "").trim() || !String(note.text || "").trim()) {
    fail("een openbare notitie mist id, datum of tekst");
  }
  if (noteIds.has(note.id)) fail(`dubbele notitie-id: ${note.id}`);
  noteIds.add(note.id);
}

console.log(`${content.articles.length} openbare artikelen en ${content.notes.length} openbare notities gecontroleerd.`);
