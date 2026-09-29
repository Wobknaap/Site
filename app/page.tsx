import { SiteFooter, SiteHeader } from "./components/site-chrome";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader active="start" />

      <nav className="home-directory page-wrap" aria-label="Inhoud">
        <a href="/artikelen/"><img className="torn-paper" src="/images/nav-artikelen.webp" alt="Artikelen" /></a>
        <a href="/projecten/"><img className="torn-paper" src="/images/nav-projecten.webp" alt="Persoonlijke projecten" /></a>
      </nav>

      <SiteFooter />
    </main>
  );
}
