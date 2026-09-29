import type { Metadata } from "next";
import { ArticleList } from "../components/article-list";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { articles } from "../content";

export const metadata: Metadata = {
  title: "Artikelen · Wob Knaap",
  description: "Columns, essays en analyses over technologie, onderwijs, beleid, studentenleven en andere onderwerpen.",
};

export default function ArticlesPage() {
  return (
    <main id="top">
      <SiteHeader active="artikelen" />
      <header className="page-intro page-wrap">
        <p className="eyebrow">Archief · {articles.length} publicaties</p>
        <h1>Artikelen</h1>
        <p>Columns en artikelen voor Cursor en De AI Workshop, bij elkaar in één overzicht. Over technologie, onderwijs, beleid, studentenleven en Eindhoven.</p>
      </header>
      <figure className="wide-image page-wrap">
        <img src="/images/hero-landscape.webp" alt="Een bankje in een groen landschap bij zonsopkomst" />
        <figcaption>Landschap bij zonsopkomst</figcaption>
      </figure>
      <section className="archive-page page-wrap">
        <ArticleList items={articles} />
      </section>
      <SiteFooter />
    </main>
  );
}
