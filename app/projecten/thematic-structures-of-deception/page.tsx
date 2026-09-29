import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import study from "../../bep-case-study.json";
export const metadata: Metadata = { title: `${study.title} · Wob Knaap`, description: study.intro };
export default function BepProject() {
 return <main id="top"><SiteHeader active="projecten" />
  <article className="case-study page-wrap">
   <a className="back-link" href="/projecten">← Persoonlijke projecten</a>
   <header className="case-intro"><p className="eyebrow">Bacheloronderzoek · TU/e · Data Science</p><h1>{study.title}</h1><p className="bep-subtitle">{study.subtitle}</p><p className="article-deck">{study.intro}</p></header>
   <section className="case-copy bep-summary" aria-label="Over het onderzoek">{study.paragraphs.map(p=><p key={p}>{p}</p>)}<div className="article-tags">{study.tags.map(t=><span className="article-tag" key={t}>{t}</span>)}</div></section>
   <section className="bep-document" aria-labelledby="document-title"><h2 id="document-title">Lees de volledige scriptie</h2><p>Engelstalig · {study.pages} pagina’s · Inclusief alle figuren en bijlagen</p><div className="case-links"><a className="underlined-link" href={study.pdf} target="_blank" rel="noreferrer">Open de PDF ↗</a><a className="underlined-link" href={study.pdf} download="Wob-Knaap-BEP.pdf">Download de scriptie ↓</a><a className="underlined-link" href={study.codeUrl}>Code op GitHub ↗</a></div><p className="pdf-help">Wordt de PDF niet weergegeven? Open of download de scriptie via de links hierboven.</p><iframe className="pdf-viewer" src={`${study.pdf}#view=FitH`} title="Volledige bachelorscriptie van Wob Knaap, inclusief figuren en bijlagen" loading="lazy" /></section>
  </article><SiteFooter /></main>;
}
