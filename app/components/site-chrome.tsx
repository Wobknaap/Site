type ActivePage = "start" | "artikelen" | "projecten" | "over";

export function SiteHeader({ active }: { active?: ActivePage }) {
  const links: Array<[ActivePage, string, string, string]> = [
    ["artikelen", "/artikelen", "Artikelen", "/images/nav-artikelen.webp"],
    ["projecten", "/projecten", "Persoonlijke projecten", "/images/nav-projecten.webp"],
    ["over", "/over", "Over mij", "/images/nav-over-mij.webp"],
  ];

  return (
    <header className="site-header">
      <a className="wordmark torn-paper" href="/" aria-label="Startpagina Wob Knaap"><img src="/images/wob-knaap-signature.webp" alt="Wob Knaap" /></a>
      <nav aria-label="Hoofdnavigatie">
        {links.map(([key, href, label, image]) => (
          <a className={`torn-paper ${active === key ? "active" : ""}`} href={href} key={key} aria-current={active === key ? "page" : undefined}><img src={image} alt={label} /></a>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© 2026</p>
      <div><a href="#top">Naar boven ↑</a></div>
    </footer>
  );
}
