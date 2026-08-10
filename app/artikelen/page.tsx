import type { Metadata } from "next";
import { ArticleList } from "../components/article-list";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { articles } from "../content";

export const metadata: Metadata = {
  title: "Artikelen · Wob Knaap",
  description: "Essays, columns en analyses van Wob Knaap over technologie, politiek en Eindhoven.",
};

export default function ArticlesPage() {
  return (
    <main id="top">
      <SiteHeader active="artikelen" />
      <header className="page-intro page-wrap">
        <p className="eyebrow">Archief · {articles.length} teksten</p>
        <h1>Artikelen</h1>
        <p>Essays, columns en analyses over technologie, beleid, AI en Eindhoven.</p>
      </header>
      <figure className="wide-image page-wrap">
        <img src="/images/circuit-detail.webp" alt="Detail van een verweerde groene printplaat" />
        <figcaption>Detail van een printplaat</figcaption>
      </figure>
      <section className="archive-page page-wrap">
        <ArticleList items={articles} />
      </section>
      <SiteFooter />
    </main>
  );
}
