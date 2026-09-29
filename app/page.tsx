import { ArticleList } from "./components/article-list";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { featuredArticles } from "./content";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader active="start" />

      <section className="home-latest page-wrap">
        <div className="section-heading home-section-heading">
          <h1>Artikelen</h1>
          <a className="underlined-link" href="/artikelen">Alle artikelen</a>
        </div>
        <ArticleList items={featuredArticles.slice(0, 4)} />
      </section>

      <section className="home-projects page-wrap">
        <h2>Projecten</h2>
        <ul>
          <li><a href="/projecten/appie-sniper">Wat verschijnt er in het afprijsrek?</a><span>Data · Python</span></li>
          <li><a href="/projecten/thematic-structures-of-deception">Thematic Structures of Deception</a><span>Bachelor eindproject</span></li>
        </ul>
        <a className="underlined-link" href="/projecten">Alle projecten</a>
      </section>

      <SiteFooter />
    </main>
  );
}
