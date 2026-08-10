import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Over mij · Wob Knaap",
  description: "Over Wob Knaap, Data Science, technologie, beleid en Eindhoven.",
};

export default function AboutPage() {
  return (
    <main id="top">
      <SiteHeader active="over" />
      <section className="about-page page-wrap">
        <div className="about-copy">
          <p className="eyebrow">Over mij</p>
          <h1>Over Wob Knaap.</h1>
          <div className="prose">
            <p>Ik studeer Data Science en werk aan projecten op het gebied van technologie, beleid en communicatie.</p>
            <p>Op deze site verzamel ik mijn columns, essays en notities. De onderwerpen lopen uiteen van AI en digitale platforms tot studentenbeleid en Eindhoven.</p>
            <p>Daarnaast ontwikkel en geef ik workshops over praktische toepassingen van AI.</p>
          </div>
        </div>
        <figure>
          <img src="/images/writing-desk.webp" alt="Een rustige schrijftafel naast een raam met uitzicht op groen" />
          <figcaption>Werkplek · Eindhoven</figcaption>
        </figure>
      </section>
      <SiteFooter />
    </main>
  );
}
