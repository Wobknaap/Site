import { ArticleList } from "./components/article-list";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { featuredArticles } from "./content";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader active="start" />

      <section className="terminal-banner" aria-label="Groene glazen bouwstenen">
        <img src="/images/glass-terminal-banner.webp" alt="Groene glazen bouwstenen met lichtreflecties" fetchPriority="high" />
      </section>

      <section className="home-hero page-wrap">
        <div className="hero-copy">
          <h1>Columns, essays en projecten.</h1>
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
        <ArticleList items={featuredArticles} />
        <a className="underlined-link archive-link" href="/artikelen">Alle artikelen bekijken ↗</a>
      </section>

      <section className="home-projects page-wrap">
        <div>
          <p className="eyebrow">Persoonlijke projecten</p>
          <h2>Van idee naar toepassing.</h2>
          <a className="underlined-link" href="/projecten">Bekijk mijn projecten ↗</a>
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
