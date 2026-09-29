import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Over mij · Wob Knaap",
  description: "Wob Knaap studeert Data Science aan de TU/e, schrijft voor Cursor en geeft AI-workshops.",
};

export default function AboutPage() {
  return (
    <main id="top">
      <SiteHeader active="over" />
      <section className="about-page page-wrap">
        <div className="about-copy">
          <h1 className="handwritten-heading"><img className="torn-paper" src="/images/nav-over-mij.webp" alt="Over mij" /></h1>
          <div className="prose">
            <p>Ik studeer Data Science aan de TU/e. Sinds 2024 schrijf ik columns voor Cursor over studentenleven, onderwijs, technologie en Eindhoven.</p>
            <p>Op deze site houd ik mijn columns en langere artikelen bij, waaronder mijn stukken voor De AI Workshop.</p>
            <p>Daarnaast ontwikkel en geef ik AI-workshops voor bedrijven, overheden en onderwijsinstellingen.</p>
          </div>
        </div>
        <figure>
          <img src="/images/wob-knaap.jpg" alt="Portret van Wob Knaap" />
          <figcaption>Wob Knaap · 2024</figcaption>
        </figure>
      </section>
      <SiteFooter />
    </main>
  );
}
