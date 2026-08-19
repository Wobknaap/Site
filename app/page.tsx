import { ArticleList } from "./components/article-list";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { articles } from "./content";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader active="start" />

      <section className="terminal-banner" aria-label="Wob Knaap persoonlijk archief">
        <img src="/images/glass-terminal-banner.webp" alt="Groene glazen bouwstenen met lichtreflecties" fetchPriority="high" />
        <div className="banner-interface page-wrap">
          <div><span>WOB.KNAAP</span><span>PERSOONLIJK ARCHIEF</span></div>
          <p>ARTIKELEN&nbsp;&nbsp; NOTITIES&nbsp;&nbsp; OVER MIJ</p>
          <div>EINDHOVEN · 2026</div>
        </div>
      </section>

      <section className="home-hero page-wrap">
        <div className="hero-copy">
          <p className="eyebrow">Wob Knaap · Eindhoven</p>
          <h1>Columns en notities.</h1>
          <div className="hero-side">
            <p className="hero-deck">Over studentenleven, onderwijs, technologie en Eindhoven.</p>
            <a className="underlined-link" href="/artikelen">Naar de artikelen ↗</a>
          </div>
        </div>
      </section>

      <section className="home-latest page-wrap">
        <div className="section-heading">
          <div><span>01</span><p>Archief</p></div>
          <h2>Recent gepubliceerd</h2>
        </div>
        <ArticleList items={articles.slice(0, 3)} />
      </section>

      <section className="home-notes page-wrap">
        <div>
          <p className="eyebrow">Notities</p>
          <h2>Ideeën die nog niet af zijn.</h2>
          <a className="underlined-link" href="/notities">Naar de notities ↗</a>
        </div>
        <figure>
          <img src="/images/hero-landscape.webp" alt="Een bankje in een groen landschap bij zonsopkomst" loading="lazy" />
          <figcaption>Landschap bij zonsopkomst</figcaption>
        </figure>
      </section>

      <SiteFooter />
    </main>
  );
}
