import { ArticleList } from "./components/article-list";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { articles } from "./content";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader active="start" />

      <section className="terminal-banner" aria-label="Groene glazen bouwstenen">
        <img src="/images/glass-terminal-banner.webp" alt="Groene glazen bouwstenen met lichtreflecties" fetchPriority="high" />
      </section>

      <section className="home-hero page-wrap">
        <div className="hero-copy">
          <h1>Columns, essays en notities.</h1>
          <div className="hero-side">
            <p className="hero-deck">Over technologie, onderwijs, beleid, studentenleven en hoe die onderwerpen elkaar raken.</p>
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
