import type { Article } from "../content";

export function ArticleList({ items, compact = false }: { items: Article[]; compact?: boolean }) {
  return (
    <div className={`article-list ${compact ? "compact" : ""}`}>
      {items.map((article, index) => {
        const external = article.status === "external";
        const href = external ? article.sourceUrl : `/artikelen/${article.slug}`;
        const linkProps = external ? { target: "_blank", rel: "noreferrer" } : {};

        return (
          <article className="article-row" key={article.slug}>
            <span className="article-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="article-copy">
              <div className="article-meta">
                <span>{article.type}{external ? ` · ${article.source}` : ""}</span>
                <time>{article.date}</time>
              </div>
              <h2><a href={href} {...linkProps}>{article.title}</a></h2>
              {!compact && <p>{article.excerpt}</p>}
            </div>
            <a className="article-link" href={href} aria-label={`Lees ${article.title}`} {...linkProps}>
              {external ? "Bron ↗" : "Lees ↗"}
            </a>
          </article>
        );
      })}
    </div>
  );
}
