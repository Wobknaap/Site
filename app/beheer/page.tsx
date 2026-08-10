import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { contentStore } from "../content";
import { ContentManager } from "./content-manager";

export const metadata: Metadata = {
  title: "Contentbeheer · Wob Knaap",
  description: "Lokaal contentbeheer voor de persoonlijke site van Wob Knaap.",
  robots: { index: false, follow: false },
};

export default function ContentManagerPage() {
  return (
    <main id="top">
      <SiteHeader />
      <header className="manager-intro page-wrap">
        <p className="eyebrow">Lokaal contentbeheer</p>
        <h1>Beheer</h1>
        <p>Schrijf, orden en bewaar artikelen en notities in één contentbestand.</p>
      </header>
      <ContentManager initialContent={contentStore} />
      <SiteFooter />
    </main>
  );
}
