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
          <div><span className="online-dot" /> ONLINE</div>
        </div>
      </section>

      <section className="home-hero page-wrap">
        <div className="hero-copy">
          <p className="eyebrow">Persoonlijk archief · Eindhoven</p>
          <h1>Columns, essays en notities.</h1>
          <p className="hero-deck">Over technologie, beleid, AI en Eindhoven.</p>
          <a className="underlined-link" href="/artikelen">Bekijk alle artikelen ↗</a>
        </div>
      </section>

      <section className="home-latest page-wrap">
        <div className="section-heading">
          <div><span>01</span><p>Recent geschreven</p></div>
          <h2>Laatste artikelen</h2>
        </div>
        <ArticleList items={articles.slice(0, 3)} />
      </section>

      <section className="home-notes page-wrap">
        <div>
          <p className="eyebrow">Losse notities</p>
          <h2>Korte observaties en ideeën in ontwikkeling.</h2>
          <a className="underlined-link" href="/notities">Lees de notities ↗</a>
        </div>
        <figure>
          <img src="/images/circuit-detail.webp" alt="Detail van een verweerde groene printplaat" loading="lazy" />
          <figcaption>Detail van een printplaat</figcaption>
        </figure>
      </section>

      <SiteFooter />
    </main>
  );
}
