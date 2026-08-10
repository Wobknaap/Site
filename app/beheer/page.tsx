import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { contentStore } from "../content";
import { ContentManager } from "./content-manager";

export function generateMetadata(): Metadata {
  if (process.env.NODE_ENV !== "development") {
    return {
      title: "Pagina niet gevonden · Wob Knaap",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: "Contentbeheer · Wob Knaap",
    description: "Lokaal contentbeheer voor de persoonlijke site van Wob Knaap.",
    robots: { index: false, follow: false },
  };
}

export default function ContentManagerPage() {
  if (process.env.NODE_ENV !== "development") notFound();

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
