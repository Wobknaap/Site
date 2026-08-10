import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { publishedArticles } from "../../content";

export function generateStaticParams() {
  return publishedArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = publishedArticles.find((item) => item.slug === slug);
  return article ? { title: `${article.title} · Wob Knaap`, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <main id="top">
      <SiteHeader active="artikelen" />
      <article className="article-page page-wrap">
        <a className="back-link" href="/artikelen">← Alle artikelen</a>
        <header>
          <p className="eyebrow">{article.type} · {article.date} · {article.reading}</p>
          <h1>{article.title}</h1>
          <p className="article-deck">{article.excerpt}</p>
        </header>
        {article.coverImage && <img className="article-cover" src={article.coverImage} alt="" />}
        <div className="article-body"><ReactMarkdown>{article.body}</ReactMarkdown></div>
        <footer className="article-end"><span>Wob Knaap · {article.date}</span><a href="/artikelen">Alle artikelen ↗</a></footer>
      </article>
      <SiteFooter />
    </main>
  );
}
