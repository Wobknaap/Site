import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "docs");
const rawBasePath = process.env.PAGES_BASE_PATH ?? "/Site";
const basePath = rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "");
const content = JSON.parse(await readFile(path.join(projectRoot, "app/content-data.json"), "utf8"));
const articles = content.articles.filter((article) => article.status === "published" || (article.status === "external" && article.sourceUrl));

const bep = JSON.parse(await readFile(path.join(projectRoot, "app/bep-case-study.json"), "utf8"));
const study = JSON.parse(await readFile(path.join(projectRoot, "app/appie-case-study.json"), "utf8"));
const projects = JSON.parse(await readFile(path.join(projectRoot, "app/projects-data.json"), "utf8"));
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
    ["artikelen", "/artikelen/", "Artikelen", "/images/nav-artikelen.webp"],
    ["projecten", "/projecten/", "Persoonlijke projecten", "/images/nav-projecten.webp"],
    ["over", "/over/", "Over mij", "/images/nav-over-mij.webp"],
  ];
  return `<header class="site-header">
    <a class="wordmark" href="${href("/")}" aria-label="Startpagina Wob Knaap"><img src="${href("/images/wob-knaap-signature.webp")}" alt="Wob Knaap"></a>
    <nav aria-label="Hoofdnavigatie">${links.map(([key, url, label, image]) => `<a class="torn-paper${active === key ? ' active' : ""}"${active === key ? ' aria-current="page"' : ""} href="${href(url)}"><img src="${href(image)}" alt="${label}"></a>`).join("")}</nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer"><p>© 2026</p><div><a href="#top">Naar boven ↑</a></div></footer>`;
}

function layout({ title, description, active, body, embedPdf = false }) {
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#294578">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self' data:; style-src 'self'; font-src 'self'; object-src ${embedPdf ? "'self'" : "'none'"}; base-uri 'none'; form-action 'none'; connect-src 'none'; frame-src ${embedPdf ? "'self'" : "'none'"}; script-src 'none'">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${href("/favicon.svg")}">
  <link rel="stylesheet" href="${href("/assets/site-v8.css")}">
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
await cp(path.join(projectRoot, "public/documents"), path.join(outputRoot, "documents"), { recursive: true });
await cp(path.join(projectRoot, "public/favicon.svg"), path.join(outputRoot, "favicon.svg"));

const sourceCss = await readFile(path.join(projectRoot, "app/globals.css"), "utf8");
const staticCss = sourceCss
  .replace(/\/\* manager:start \*\/[\s\S]*?\/\* manager:end \*\//g, "")
  .replaceAll("var(--font-geist-sans)", "Arial, sans-serif")
  .replaceAll("var(--font-geist-mono)", '"Courier New", monospace')
  .replaceAll('url("/images/', 'url("../images/');
await writeFile(path.join(outputRoot, "assets/site-v8.css"), staticCss);
await writeFile(path.join(outputRoot, ".nojekyll"), "");
await writeFile(path.join(outputRoot, "robots.txt"), `User-agent: *\nAllow: ${href("/")}\nDisallow: ${href("/beheer/")}\n`);

await writeRoute("/", layout({
  title: "Wob Knaap · artikelen en projecten",
  description: "Artikelen en persoonlijke projecten van Wob Knaap.",
  active: "start",
  body: `<main id="top"><nav class="home-directory page-wrap" aria-label="Inhoud"><a href="${href("/artikelen/")}"><img class="torn-paper" src="${href("/images/nav-artikelen.webp")}" alt="Artikelen"></a><a href="${href("/projecten/")}"><img class="torn-paper" src="${href("/images/nav-projecten.webp")}" alt="Persoonlijke projecten"></a></nav></main>`,
}));

await writeRoute("/artikelen", layout({
  title: "Artikelen · Wob Knaap",
  description: "Columns, essays en analyses over technologie, onderwijs, beleid, studentenleven en andere onderwerpen.",
  active: "artikelen",
  body: `<main id="top"><header class="page-intro page-wrap"><p class="eyebrow">Archief · ${articles.length} publicaties</p><h1 class="handwritten-heading archive-handwritten-heading"><img class="torn-paper" src="${href("/images/nav-artikelen.webp")}" alt="Artikelen"></h1><p>Artikelen over technologie, onderwijs, beleid, studentenleven en Eindhoven.</p></header><section class="archive-page page-wrap">${articleList(articles)}</section></main>`,
}));

await writeRoute("/projecten", layout({
  title: "Persoonlijke projecten · Wob Knaap",
  description: "Eigen projecten en onderzoek met data, taal en technologie.",
  active: "projecten",
  body: `<main id="top"><header class="page-intro projects-intro page-wrap"><p class="eyebrow">Data · taal · technologie</p><h1 class="handwritten-heading projects-handwritten-heading"><img class="torn-paper" src="${href("/images/nav-projecten.webp")}" alt="Persoonlijke projecten"></h1></header><section class="project-grid page-wrap" aria-label="Projecten">${projects.map(project => `<article class="project-card"><p class="eyebrow">${escapeHtml(project.category)}</p><h2><a href="${escapeHtml(project.href.startsWith("https:") ? project.href : href(project.href + "/"))}">${escapeHtml(project.title)}</a></h2><p>${escapeHtml(project.description)}</p><div class="article-tags">${project.tags.map(tag => `<span class="article-tag">${escapeHtml(tag)}</span>`).join("")}</div><a class="underlined-link archive-link" href="${escapeHtml(project.href.startsWith("https:") ? project.href : href(project.href + "/"))}">${project.href.startsWith("https:") ? "Bekijk op GitHub ↗" : "Bekijk het project ↗"}</a></article>`).join("")}</section></main>`,
}));

await writeRoute("/projecten/appie-sniper", layout({
 title: `${study.title} · Wob Knaap`, description: study.intro, active: "projecten",
 body: `<main id="top"><article class="case-study page-wrap">
 <a class="back-link" href="${href("/projecten/")}">← Persoonlijke projecten</a>
 <header class="case-intro"><p class="eyebrow">Appie Sniper · Persoonlijk project · 2026</p><h1>${escapeHtml(study.title)}</h1><p class="article-deck">${escapeHtml(study.intro)}</p></header>
 <div class="case-stats"><div><strong>72.836</strong><span>waarnemingen</span></div><div><strong>315</strong><span>meetmomenten</span></div><div><strong>1.324</strong><span>productnamen</span></div><div><strong>22</strong><span>dagen</span></div></div>
 <section class="case-copy"><h2>${escapeHtml(study.buildTitle)}</h2>${study.build.map((p,index)=>`<p>${index===0?`Ik bouwde voort op bestaande reverse-engineering van de AH-app-API, waaronder <a href="${escapeHtml(study.apiSources[0].url)}" target="_blank" rel="noreferrer">de documentatie van jabbink</a> en <a href="${escapeHtml(study.apiSources[1].url)}" target="_blank" rel="noreferrer">appie-go van gwillem</a>. `:""}${escapeHtml(p)}</p>`).join("")}<div class="article-tags">${study.stack.map(tag=>`<span class="article-tag">${escapeHtml(tag)}</span>`).join("")}</div></section>
 <div class="case-screens"><figure><a href="${href("/images/appie/dashboard.webp")}"><img src="${href("/images/appie/dashboard.webp")}" alt="Appie Sniper-dashboard met winkelkeuze en een ranglijst van koopjes" loading="lazy"></a><figcaption>Het dashboard: aanbiedingen voor de gekozen winkel.</figcaption></figure><figure><a href="${href("/images/appie/verspakketten.webp")}"><img src="${href("/images/appie/verspakketten.webp")}" alt="Verspakketten met voorgestelde aanvullende ingrediënten in Appie Sniper" loading="lazy"></a><figcaption>Verspakketten met matches op basis van trefwoordregels.</figcaption></figure></div>
 ${study.figures.map(f=>`<section class="case-figure"><div class="case-copy"><h2>${escapeHtml(f.title)}</h2><p>${escapeHtml(f.text)}</p></div><figure><a href="${href(`/images/appie/${f.image}.svg`)}" aria-label="Vergroot: ${escapeHtml(f.title)}"><img src="${href(`/images/appie/${f.image}.svg`)}" alt="${escapeHtml(f.alt)}" loading="lazy"></a><figcaption>Klik op de grafiek om deze te vergroten.</figcaption></figure></section>`).join("")}
 <aside class="case-method"><h2>Over de data</h2><p>${escapeHtml(study.method)}</p><div class="case-links"><a class="underlined-link" href="${escapeHtml(study.sourceUrl)}">Code op GitHub ↗</a><a class="underlined-link" href="${escapeHtml(study.dataUrl)}">Bekijk de brondata ↗</a></div></aside>
 </article></main>`,
}));

await writeRoute("/projecten/thematic-structures-of-deception", layout({
 title: `${bep.title} · Wob Knaap`, description: bep.intro, active: "projecten", embedPdf: true,
 body: `<main id="top"><article class="case-study page-wrap">
 <a class="back-link" href="${href("/projecten/")}">← Persoonlijke projecten</a>
 <header class="case-intro"><p class="eyebrow">Bacheloronderzoek · TU/e · Data Science</p><h1>${escapeHtml(bep.title)}</h1><p class="bep-subtitle">${escapeHtml(bep.subtitle)}</p><p class="article-deck">${escapeHtml(bep.intro)}</p></header>
 <section class="case-copy bep-summary" aria-label="Over het onderzoek">${bep.paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join("")}<div class="article-tags">${bep.tags.map(t=>`<span class="article-tag">${escapeHtml(t)}</span>`).join("")}</div></section>
 <section class="bep-document" aria-labelledby="document-title"><h2 id="document-title">Lees de volledige scriptie</h2><p>Engelstalig · ${bep.pages} pagina’s · Inclusief alle figuren en bijlagen</p><div class="case-links"><a class="underlined-link" href="${href(bep.pdf)}" target="_blank" rel="noreferrer">Open de PDF ↗</a><a class="underlined-link" href="${href(bep.pdf)}" download="Wob-Knaap-BEP.pdf">Download de scriptie ↓</a><a class="underlined-link" href="${escapeHtml(bep.codeUrl)}">Code op GitHub ↗</a></div><p class="pdf-help">Wordt de PDF niet weergegeven? Open of download de scriptie via de links hierboven.</p><iframe class="pdf-viewer" src="${href(bep.pdf)}#view=FitH" title="Volledige bachelorscriptie van Wob Knaap, inclusief figuren en bijlagen" loading="lazy"></iframe></section>
 </article></main>`,
}));

await writeRoute("/over", layout({
  title: "Over mij · Wob Knaap",
  description: "Wob Knaap studeert Data Science aan de TU/e, schrijft voor Cursor en geeft AI-workshops.",
  active: "over",
  body: `<main id="top"><section class="about-page page-wrap"><div class="about-copy"><p class="eyebrow">Over mij</p><h1>Over Wob Knaap.</h1><div class="prose"><p>Ik studeer Data Science aan de TU/e. Sinds 2024 schrijf ik columns voor Cursor over studentenleven, onderwijs, technologie en Eindhoven.</p><p>Op deze site houd ik mijn columns en langere artikelen bij, waaronder mijn stukken voor De AI Workshop.</p><p>Daarnaast ontwikkel en geef ik AI-workshops voor bedrijven, overheden en onderwijsinstellingen.</p></div></div><figure><img src="${href("/images/wob-knaap.jpg")}" alt="Portret van Wob Knaap"><figcaption>Wob Knaap · 2024</figcaption></figure></section></main>`,
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
