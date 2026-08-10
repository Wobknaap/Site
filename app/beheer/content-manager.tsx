"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Article, ArticleSource, ArticleStatus, ContentStore, Note } from "../content";

type ManagerView = "articles" | "notes";
type WritableHandle = {
  getFile: () => Promise<File>;
  createWritable: () => Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>;
};

const storageKey = "wob-content-manager-v1";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cloneContent(content: ContentStore): ContentStore {
  return JSON.parse(JSON.stringify(content)) as ContentStore;
}

function isContentStore(value: unknown): value is ContentStore {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<ContentStore>;
  return Array.isArray(candidate.articles) && Array.isArray(candidate.notes);
}

function makeArticle(): Article {
  return {
    slug: `nieuw-artikel-${Date.now()}`,
    date: new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    type: "Essay",
    title: "Nieuw artikel",
    excerpt: "",
    reading: "",
    body: "",
    status: "draft",
    source: "Eigen site",
    sourceUrl: "",
    coverImage: "",
    editorialNote: "",
  };
}

function makeNote(): Note {
  return {
    id: `note-${Date.now()}`,
    date: new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
    text: "Nieuwe notitie",
  };
}

export function ContentManager({ initialContent }: { initialContent: ContentStore }) {
  const [content, setContent] = useState<ContentStore>(() => cloneContent(initialContent));
  const [view, setView] = useState<ManagerView>("articles");
  const [selectedSlug, setSelectedSlug] = useState(initialContent.articles[0]?.slug ?? "");
  const [fileHandle, setFileHandle] = useState<WritableHandle | null>(null);
  const [message, setMessage] = useState("Wijzigingen worden tijdelijk in deze browser bewaard.");
  const [dirty, setDirty] = useState(false);
  const importedFile = useRef<HTMLInputElement>(null);
  const restoredWorkspace = useRef(false);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(storageKey);
      restoredWorkspace.current = true;
      if (!saved) return;
      try {
        const parsed: unknown = JSON.parse(saved);
        if (isContentStore(parsed)) {
          setContent(parsed);
          setSelectedSlug(parsed.articles[0]?.slug ?? "");
          setMessage("Lokale werksessie hersteld.");
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!restoredWorkspace.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify(content));
  }, [content]);

  const selectedArticle = useMemo(
    () => content.articles.find((article) => article.slug === selectedSlug) ?? content.articles[0],
    [content.articles, selectedSlug],
  );

  const counts = useMemo(() => ({
    published: content.articles.filter((article) => article.status === "published").length,
    draft: content.articles.filter((article) => article.status === "draft").length,
    external: content.articles.filter((article) => article.status === "external").length,
  }), [content.articles]);

  function changeContent(next: ContentStore) {
    setContent(next);
    setDirty(true);
    setMessage("Nog niet opgeslagen in het projectbestand.");
  }

  function updateArticle<K extends keyof Article>(field: K, value: Article[K]) {
    if (!selectedArticle) return;
    const previousSlug = selectedArticle.slug;
    const next = {
      ...content,
      articles: content.articles.map((article) => article.slug === previousSlug ? { ...article, [field]: value } : article),
    };
    changeContent(next);
    if (field === "slug") setSelectedSlug(value);
  }

  function addArticle() {
    const article = makeArticle();
    changeContent({ ...content, articles: [article, ...content.articles] });
    setSelectedSlug(article.slug);
    setView("articles");
  }

  function deleteArticle() {
    if (!selectedArticle || !window.confirm(`Verwijder "${selectedArticle.title}" uit het contentbestand?`)) return;
    const remaining = content.articles.filter((article) => article.slug !== selectedArticle.slug);
    changeContent({ ...content, articles: remaining });
    setSelectedSlug(remaining[0]?.slug ?? "");
  }

  function updateNote<K extends keyof Note>(id: string, field: K, value: Note[K]) {
    changeContent({
      ...content,
      notes: content.notes.map((note) => note.id === id ? { ...note, [field]: value } : note),
    });
  }

  function addNote() {
    changeContent({ ...content, notes: [makeNote(), ...content.notes] });
    setView("notes");
  }

  function deleteNote(id: string) {
    changeContent({ ...content, notes: content.notes.filter((note) => note.id !== id) });
  }

  async function openProjectFile() {
    const picker = (window as Window & {
      showOpenFilePicker?: (options: unknown) => Promise<WritableHandle[]>;
    }).showOpenFilePicker;

    if (!picker) {
      importedFile.current?.click();
      setMessage("Deze browser gebruikt de importoptie. Kies app/content-data.json.");
      return;
    }

    try {
      const [handle] = await picker({
        multiple: false,
        types: [{ description: "JSON contentbestand", accept: { "application/json": [".json"] } }],
      });
      const file = await handle.getFile();
      const parsed: unknown = JSON.parse(await file.text());
      if (!isContentStore(parsed)) throw new Error("Onjuist contentformaat");
      setFileHandle(handle);
      setContent(parsed);
      setSelectedSlug(parsed.articles[0]?.slug ?? "");
      setDirty(false);
      setMessage(`${file.name} is geopend. Wijzigingen kunnen direct naar dit bestand worden opgeslagen.`);
    } catch (error) {
      if ((error as Error).name !== "AbortError") setMessage("Het bestand kon niet worden geopend.");
    }
  }

  async function importJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isContentStore(parsed)) throw new Error("Onjuist contentformaat");
      setContent(parsed);
      setSelectedSlug(parsed.articles[0]?.slug ?? "");
      setDirty(true);
      setMessage(`${file.name} is geïmporteerd. Download het bijgewerkte bestand na je wijzigingen.`);
    } catch {
      setMessage("Dit is geen geldig contentbestand.");
    } finally {
      event.target.value = "";
    }
  }

  async function saveProjectFile() {
    if (!fileHandle) {
      downloadJson();
      setMessage("Contentbestand gedownload. Vervang hiermee app/content-data.json in de projectmap.");
      return;
    }
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(`${JSON.stringify(content, null, 2)}\n`);
      await writable.close();
      setDirty(false);
      setMessage("Opgeslagen in app/content-data.json. De lokale site ververst automatisch.");
    } catch {
      setMessage("Opslaan is niet gelukt. Download het JSON-bestand als alternatief.");
    }
  }

  function downloadJson() {
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "content-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetWorkspace() {
    if (!window.confirm("Lokale wijzigingen wissen en teruggaan naar de meegeleverde content?")) return;
    const reset = cloneContent(initialContent);
    setContent(reset);
    setSelectedSlug(reset.articles[0]?.slug ?? "");
    setFileHandle(null);
    setDirty(false);
    window.localStorage.removeItem(storageKey);
    setMessage("Teruggezet naar de meegeleverde content.");
  }

  return (
    <section className="manager page-wrap">
      <div className="manager-toolbar">
        <div className="manager-tabs" role="tablist" aria-label="Contentsoort">
          <button className={view === "articles" ? "active" : ""} onClick={() => setView("articles")}>Artikelen ({content.articles.length})</button>
          <button className={view === "notes" ? "active" : ""} onClick={() => setView("notes")}>Notities ({content.notes.length})</button>
        </div>
        <div className="manager-actions">
          <button onClick={openProjectFile}>Contentbestand openen</button>
          <button className="primary" onClick={saveProjectFile}>{fileHandle ? "Opslaan" : "JSON downloaden"}</button>
          <input ref={importedFile} type="file" accept="application/json,.json" onChange={importJson} hidden />
        </div>
      </div>

      <div className="manager-status" aria-live="polite">
        <span className={dirty ? "status-dot dirty" : "status-dot"} />
        <p>{message}</p>
        <button onClick={resetWorkspace}>Werksessie wissen</button>
      </div>

      {view === "articles" ? (
        <div className="manager-layout">
          <aside className="manager-index">
            <div className="manager-counts">
              <span>{counts.published} online</span>
              <span>{counts.draft} concept</span>
              <span>{counts.external} extern</span>
            </div>
            <button className="new-item" onClick={addArticle}>+ Nieuw artikel</button>
            <div className="manager-items">
              {content.articles.map((article) => (
                <button className={article.slug === selectedArticle?.slug ? "selected" : ""} onClick={() => setSelectedSlug(article.slug)} key={article.slug}>
                  <span>{article.status === "published" ? "Online" : article.status === "external" ? "Extern" : "Concept"}</span>
                  <strong>{article.title || "Zonder titel"}</strong>
                  <small>{article.source}{article.status === "external" && !article.sourceUrl ? " · link ontbreekt" : ""}</small>
                </button>
              ))}
            </div>
          </aside>

          {selectedArticle ? (
            <form className="manager-editor" onSubmit={(event) => event.preventDefault()}>
              <div className="manager-editor-head">
                <div><p className="eyebrow">Artikel bewerken</p><h2>{selectedArticle.title || "Zonder titel"}</h2></div>
                <button className="danger" type="button" onClick={deleteArticle}>Verwijderen</button>
              </div>

              <div className="field-grid">
                <label className="field field-wide">Titel<input value={selectedArticle.title} onChange={(event) => updateArticle("title", event.target.value)} /></label>
                <label className="field">Slug<input value={selectedArticle.slug} onChange={(event) => updateArticle("slug", slugify(event.target.value))} /></label>
                <label className="field">Datum<input value={selectedArticle.date} onChange={(event) => updateArticle("date", event.target.value)} /></label>
                <label className="field">Status<select value={selectedArticle.status} onChange={(event) => updateArticle("status", event.target.value as ArticleStatus)}><option value="draft">Concept</option><option value="published">Online op eigen site</option><option value="external">Externe publicatie</option></select></label>
                <label className="field">Type<select value={selectedArticle.type} onChange={(event) => updateArticle("type", event.target.value as Article["type"])}><option>Essay</option><option>Column</option><option>Analyse</option></select></label>
                <label className="field">Bron<select value={selectedArticle.source} onChange={(event) => updateArticle("source", event.target.value as ArticleSource)}><option>Eigen site</option><option>Cursor</option><option>De AI Workshop</option></select></label>
                <label className="field">Leestijd<input value={selectedArticle.reading} placeholder="8 minuten" onChange={(event) => updateArticle("reading", event.target.value)} /></label>
                <label className="field field-wide">Bronlink<input type="url" value={selectedArticle.sourceUrl} placeholder="https://..." onChange={(event) => updateArticle("sourceUrl", event.target.value)} /></label>
                <label className="field field-wide">Afbeelding<input value={selectedArticle.coverImage} placeholder="/images/bestandsnaam.webp" onChange={(event) => updateArticle("coverImage", event.target.value)} /></label>
                <label className="field field-wide">Korte omschrijving<textarea rows={3} value={selectedArticle.excerpt} onChange={(event) => updateArticle("excerpt", event.target.value)} /></label>
                <label className="field field-wide">Redactienotitie<textarea rows={3} value={selectedArticle.editorialNote} onChange={(event) => updateArticle("editorialNote", event.target.value)} /></label>
                <label className="field field-wide body-field">Artikeltekst <span>Markdown wordt ondersteund voor tussenkoppen, links, lijsten en citaten.</span><textarea rows={24} value={selectedArticle.body} onChange={(event) => updateArticle("body", event.target.value)} /></label>
              </div>
            </form>
          ) : <div className="manager-empty">Voeg een artikel toe om te beginnen.</div>}
        </div>
      ) : (
        <div className="notes-manager">
          <div className="notes-manager-head"><h2>Notities</h2><button className="primary" onClick={addNote}>+ Nieuwe notitie</button></div>
          {content.notes.map((note, index) => (
            <article key={note.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <label className="field">Datum<input value={note.date} onChange={(event) => updateNote(note.id, "date", event.target.value)} /></label>
              <label className="field note-text">Tekst<textarea rows={4} value={note.text} onChange={(event) => updateNote(note.id, "text", event.target.value)} /></label>
              <button className="danger" onClick={() => deleteNote(note.id)}>Verwijderen</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
