import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import study from "../../appie-case-study.json";

export const metadata: Metadata = { title: `${study.title} · Wob Knaap`, description: study.intro };
export default function AppieProject() {
 return <main id="top">
  <SiteHeader active="projecten" />
  <article className="case-study page-wrap">
   <a className="back-link" href="/projecten">← Persoonlijke projecten</a>
   <header className="case-intro"><p className="eyebrow">Appie Sniper · Persoonlijk project · 2026</p><h1>{study.title}</h1><p className="article-deck">{study.intro}</p></header>
   <div className="case-stats"><div><strong>72.836</strong><span>waarnemingen</span></div><div><strong>315</strong><span>meetmomenten</span></div><div><strong>1.324</strong><span>productnamen</span></div><div><strong>22</strong><span>dagen</span></div></div>
   <section className="case-copy"><h2>{study.buildTitle}</h2>{study.build.map((p, index) => <p key={p}>{p}{index === 0 && <> Zie ook <a href={study.apiSources[0].url} target="_blank" rel="noreferrer">{study.apiSources[0].label}</a> en <a href={study.apiSources[1].url} target="_blank" rel="noreferrer">{study.apiSources[1].label}</a>.</>}</p>)}<div className="article-tags">{study.stack.map(tag=><span className="article-tag" key={tag}>{tag}</span>)}</div></section>
   <div className="case-screens"><figure><a href="/images/appie/dashboard.webp"><img src="/images/appie/dashboard.webp" alt="Appie Sniper-dashboard met winkelkeuze en een ranglijst van koopjes" loading="lazy" /></a><figcaption>Het dashboard: aanbiedingen voor de gekozen winkel.</figcaption></figure><figure><a href="/images/appie/verspakketten.webp"><img src="/images/appie/verspakketten.webp" alt="Verspakketten met voorgestelde aanvullende ingrediënten in Appie Sniper" loading="lazy" /></a><figcaption>Verspakketten met matches op basis van trefwoordregels.</figcaption></figure></div>
   {study.figures.map(f=><section className="case-figure" key={f.image}><div className="case-copy"><h2>{f.title}</h2><p>{f.text}</p></div><figure><a href={`/images/appie/${f.image}.svg`} aria-label={`Vergroot: ${f.title}`}><img src={`/images/appie/${f.image}.svg`} alt={f.alt} loading="lazy" /></a><figcaption>Klik op de grafiek om deze te vergroten.</figcaption></figure></section>)}
   <aside className="case-method"><h2>Over de data</h2><p>{study.method}</p><div className="case-links"><a className="underlined-link" href={study.sourceUrl}>Code op GitHub ↗</a><a className="underlined-link" href={study.dataUrl}>Bekijk de brondata ↗</a></div></aside>
  </article>
  <SiteFooter />
 </main>;
}
