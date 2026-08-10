import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { notes } from "../content";

export const metadata: Metadata = {
  title: "Notities · Wob Knaap",
  description: "Korte observaties, halve ideeën en losse gedachten van Wob Knaap.",
};

export default function NotesPage() {
  return (
    <main id="top">
      <SiteHeader active="notities" />
      <header className="page-intro page-wrap">
        <p className="eyebrow">Korte observaties en onderwerpen</p>
        <h1>Notities</h1>
        <p>Onderwerpen en observaties die nog geen volledig artikel zijn.</p>
      </header>
      <section className="notes-list page-wrap">
        {notes.map((note, index) => (
          <article key={note.date}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{note.text}</p>
            <time>{note.date}</time>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
