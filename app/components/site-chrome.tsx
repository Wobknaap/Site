type ActivePage = "start" | "artikelen" | "notities" | "over";

export function SiteHeader({ active }: { active?: ActivePage }) {
  const links: Array<[ActivePage, string, string]> = [
    ["start", "/", "Start"],
    ["artikelen", "/artikelen", "Artikelen"],
    ["notities", "/notities", "Notities"],
    ["over", "/over", "Over mij"],
  ];

  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Startpagina Wob Knaap">Wob Knaap</a>
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
      <p>Wob Knaap · Eindhoven · 2026</p>
      <div><a href="#top">Naar boven ↑</a></div>
    </footer>
  );
}
