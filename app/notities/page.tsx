import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { notes } from "../content";

export const metadata: Metadata = {
  title: "Notities · Wob Knaap",
  description: "Notities van Wob Knaap die nog niet zijn uitgewerkt tot een artikel.",
};

export default function NotesPage() {
  return (
    <main id="top">
      <SiteHeader active="notities" />
      <header className="page-intro page-wrap">
        <p className="eyebrow">In ontwikkeling</p>
        <h1>Notities</h1>
        <p>{notes.length === 0 ? "Nog geen notities gepubliceerd." : "Losse ideeën die nog niet zijn uitgewerkt tot een artikel."}</p>
      </header>
      {notes.length > 0 && (
        <section className="notes-list page-wrap">
          {notes.map((note, index) => (
            <article key={note.date}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{note.text}</p>
              <time>{note.date}</time>
            </article>
          ))}
        </section>
      )}
      <SiteFooter />
    </main>
  );
}
