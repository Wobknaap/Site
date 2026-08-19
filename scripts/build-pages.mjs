import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "docs");
const rawBasePath = process.env.PAGES_BASE_PATH ?? "/Site";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");
const content = JSON.parse(await readFile(path.join(projectRoot, "app/content-data.json"), "utf8"));
const articles = content.articles.filter((article) => article.status === "published" || (article.status === "external" && article.sourceUrl));

const href = (value = "/") => `${basePath}${value === "/" ? "/" : value}`;
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

function inlineMarkdown(value) {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let result = "";
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    result += escapeHtml(value.slice(cursor, match.index));
    result += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noreferrer">${escapeHtml(match[1])}</a>`;
    cursor = match.index + match[0].length;
  }
  return result + escapeHtml(value.slice(cursor));
}

function markdown(value) {
  return value.trim().split(/\n{2,}/).map((block) => {
    if (block.startsWith("## ")) return `<h2>${inlineMarkdown(block.slice(3))}</h2>`;
    if (block.startsWith("### ")) return `<h3>${inlineMarkdown(block.slice(4))}</h3>`;
    if (block.startsWith("> ")) return `<blockquote><p>${inlineMarkdown(block.replace(/^> ?/gm, ""))}</p></blockquote>`;
    if (/^- /m.test(block)) return `<ul>${block.split("\n").map((line) => `<li>${inlineMarkdown(line.replace(/^- /, ""))}</li>`).join("")}</ul>`;
    return `<p>${inlineMarkdown(block).replaceAll("\n", "<br>")}</p>`;
  }).join("\n");
}

function header(active) {
  const links = [
    ["start", "/", "Start"],
    ["artikelen", "/artikelen/", "Artikelen"],
    ["notities", "/notities/", "Notities"],
    ["over", "/over/", "Over mij"],
  ];
  return `<header class="site-header">
    <a class="wordmark" href="${href("/")}" aria-label="Startpagina Wob Knaap">Wob Knaap</a>
    <nav aria-label="Hoofdnavigatie">${links.map(([key, url, label]) => `<a${active === key ? ' class="active" aria-current="page"' : ""} href="${href(url)}">${label}</a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><p>Wob Knaap · Eindhoven · 2026</p><div><a href="#top">Naar boven ↑</a></div></footer>`;
}

function layout({ title, description, active, body }) {
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#264534">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; connect-src 'none'; frame-src 'none'; script-src 'none'">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${href("/favicon.svg")}">
  <link rel="stylesheet" href="${href("/assets/site.css")}">
</head>
<body>${header(active)}${body}${footer()}</body>
</html>`;
}

function articleList(items) {
  return `<div class="article-list">${items.map((article, index) => {
    const external = article.status === "external";
    const url = external ? article.sourceUrl : href(`/artikelen/${article.slug}/`);
    const externalProps = external ? ' target="_blank" rel="noreferrer"' : "";
    return `<article class="article-row">
      <span class="article-number">${String(index + 1).padStart(2, "0")}</span>
      <div class="article-copy">
        <div class="article-meta"><span>${escapeHtml(article.type)}${external ? ` · ${escapeHtml(article.source)}` : ""}</span><time>${escapeHtml(article.date)}</time><div class="article-tags" aria-label="Onderwerpen">${article.tags.map((tag) => `<span class="article-tag">${escapeHtml(tag)}</span>`).join("")}</div></div>
        <h2><a href="${escapeHtml(url)}"${externalProps}>${escapeHtml(article.title)}</a></h2>
        <p>${escapeHtml(article.excerpt)}</p>
      </div>
      <a class="article-link" href="${escapeHtml(url)}"${externalProps}>${external ? "Bron ↗" : "Lees ↗"}</a>
    </article>`;
  }).join("")}</div>`;
}

async function writeRoute(route, html) {
  const directory = route === "/" ? outputRoot : path.join(outputRoot, route.replace(/^\//, ""));
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html);
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(path.join(outputRoot, "assets"), { recursive: true });
await cp(path.join(projectRoot, "public/images"), path.join(outputRoot, "images"), { recursive: true });
await cp(path.join(projectRoot, "public/favicon.svg"), path.join(outputRoot, "favicon.svg"));

const sourceCss = await readFile(path.join(projectRoot, "app/globals.css"), "utf8");
const staticCss = sourceCss
  .replace(/\/\* manager:start \*\/[\s\S]*?\/\* manager:end \*\//g, "")
  .replaceAll("var(--font-geist-sans)", "Arial, sans-serif")
  .replaceAll("var(--font-geist-mono)", '"Courier New", monospace');
await writeFile(path.join(outputRoot, "assets/site.css"), staticCss);
await writeFile(path.join(outputRoot, ".nojekyll"), "");
await writeFile(path.join(outputRoot, "robots.txt"), `User-agent: *\nAllow: ${href("/")}\nDisallow: ${href("/beheer/")}\n`);

await writeRoute("/", layout({
  title: "Wob Knaap · columns en notities",
  description: "Columns en notities van Wob Knaap over studentenleven, onderwijs, technologie en Eindhoven.",
  active: "start",
  body: `<main id="top">
    <section class="terminal-banner" aria-label="Wob Knaap persoonlijk archief">
      <img src="${href("/images/glass-terminal-banner.webp")}" alt="Groene glazen bouwstenen met lichtreflecties">
      <div class="banner-interface page-wrap"><div><span>WOB.KNAAP</span><span>PERSOONLIJK ARCHIEF</span></div><p>ARTIKELEN&nbsp;&nbsp; NOTITIES&nbsp;&nbsp; OVER MIJ</p><div>EINDHOVEN · 2026</div></div>
    </section>
    <section class="home-hero page-wrap"><div class="hero-copy"><p class="eyebrow">Wob Knaap · Eindhoven</p><h1>Columns en notities.</h1><div class="hero-side"><p class="hero-deck">Over studentenleven, onderwijs, technologie en Eindhoven.</p><a class="underlined-link" href="${href("/artikelen/")}">Naar de artikelen ↗</a></div></div></section>
    <section class="home-latest page-wrap"><div class="section-heading"><div><span>01</span><p>Archief</p></div><h2>Recent gepubliceerd</h2></div>${articleList(articles.slice(0, 3))}</section>
    <section class="home-notes page-wrap"><div><p class="eyebrow">Notities</p><h2>Ideeën die nog niet af zijn.</h2><a class="underlined-link" href="${href("/notities/")}">Naar de notities ↗</a></div><figure><img src="${href("/images/hero-landscape.webp")}" alt="Een bankje in een groen landschap bij zonsopkomst" loading="lazy"><figcaption>Landschap bij zonsopkomst</figcaption></figure></section>
  </main>`,
}));

await writeRoute("/artikelen", layout({
  title: "Artikelen · Wob Knaap",
  description: "Columns van Wob Knaap voor Cursor over studentenleven, onderwijs, technologie en Eindhoven.",
  active: "artikelen",
  body: `<main id="top"><header class="page-intro page-wrap"><p class="eyebrow">Archief · ${articles.length} columns</p><h1>Artikelen</h1><p>Columns voor Cursor over studentenleven, onderwijs, technologie en Eindhoven.</p></header><figure class="wide-image page-wrap"><img src="${href("/images/hero-landscape.webp")}" alt="Een bankje in een groen landschap bij zonsopkomst"><figcaption>Landschap bij zonsopkomst</figcaption></figure><section class="archive-page page-wrap">${articleList(articles)}</section></main>`,
}));

await writeRoute("/notities", layout({
  title: "Notities · Wob Knaap",
  description: "Notities van Wob Knaap die nog niet zijn uitgewerkt tot een artikel.",
  active: "notities",
  body: `<main id="top"><header class="page-intro page-wrap"><p class="eyebrow">In ontwikkeling</p><h1>Notities</h1><p>${content.notes.length === 0 ? "Nog geen notities gepubliceerd." : "Losse ideeën die nog niet zijn uitgewerkt tot een artikel."}</p></header>${content.notes.length > 0 ? `<section class="notes-list page-wrap">${content.notes.map((note, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(note.text)}</p><time>${escapeHtml(note.date)}</time></article>`).join("")}</section>` : ""}</main>`,
}));

await writeRoute("/over", layout({
  title: "Over mij · Wob Knaap",
  description: "Wob Knaap studeert Data Science aan de TU/e, schrijft voor Cursor en geeft AI-workshops.",
  active: "over",
  body: `<main id="top"><section class="about-page page-wrap"><div class="about-copy"><p class="eyebrow">Over mij</p><h1>Over Wob Knaap.</h1><div class="prose"><p>Ik studeer Data Science aan de TU/e. Sinds 2024 schrijf ik columns voor Cursor over studentenleven, onderwijs, technologie en Eindhoven.</p><p>Op deze site houd ik mijn columns bij. Later komen daar langere stukken en notities bij.</p><p>Daarnaast ontwikkel en geef ik AI-workshops voor bedrijven, overheden en onderwijsinstellingen.</p></div></div><figure><img src="${href("/images/wob-knaap.jpg")}" alt="Portret van Wob Knaap"><figcaption>Wob Knaap · 2024</figcaption></figure></section></main>`,
}));

for (const article of articles.filter((item) => item.status === "published")) {
  await writeRoute(`/artikelen/${article.slug}`, layout({
    title: `${article.title} · Wob Knaap`,
    description: article.excerpt,
    active: "artikelen",
    body: `<main id="top" class="article-page page-wrap"><a class="back-link" href="${href("/artikelen/")}">← Terug naar artikelen</a><article><header><p class="eyebrow">${escapeHtml(article.type)} · ${escapeHtml(article.date)}${article.reading ? ` · ${escapeHtml(article.reading)}` : ""}</p><div class="article-tags article-page-tags" aria-label="Onderwerpen">${article.tags.map((tag) => `<span class="article-tag">${escapeHtml(tag)}</span>`).join("")}</div><h1>${escapeHtml(article.title)}</h1><p class="article-deck">${escapeHtml(article.excerpt)}</p>${article.coverImage ? `<img class="article-cover" src="${href(article.coverImage)}" alt="">` : ""}</header><div class="article-body">${markdown(article.body)}</div><footer class="article-end"><span>${escapeHtml(article.type)}</span><span>${escapeHtml(article.date)}</span></footer></article></main>`,
  }));
}

await writeFile(path.join(outputRoot, "404.html"), layout({
  title: "Pagina niet gevonden · Wob Knaap",
  description: "Deze pagina bestaat niet.",
  active: "",
  body: `<main id="top"><section class="home-hero page-wrap"><div class="hero-copy"><p class="eyebrow">404</p><h1>Pagina niet gevonden.</h1><a class="underlined-link" href="${href("/")}">Terug naar start</a></div></section></main>`,
}));

console.log(`GitHub Pages-site gebouwd in ${outputRoot} met basispad ${basePath || "/"}.`);
