type ActivePage = "start" | "artikelen" | "projecten" | "over";

export function SiteHeader({ active }: { active?: ActivePage }) {
  const links: Array<[ActivePage, string, string]> = [
    ["start", "/", "Start"],
    ["artikelen", "/artikelen", "Artikelen"],
    ["projecten", "/projecten", "Persoonlijke projecten"],
    ["over", "/over", "Over mij"],
  ];

  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Startpagina Wob Knaap"><img src="/images/wob-knaap-signature.webp" alt="Wob Knaap" /></a>
      <nav aria-label="Hoofdnavigatie">
        {links.map(([key, href, label]) => (
          <a className={active === key ? "active" : ""} href={href} key={key} aria-current={active === key ? "page" : undefined}>{label}</a>
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
