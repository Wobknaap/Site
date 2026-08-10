import rawContent from "./content-data.json";

export type ArticleStatus = "published" | "draft" | "external";
export type ArticleSource = "Eigen site" | "Cursor" | "De AI Workshop";

export type Article = {
  slug: string;
  date: string;
  type: "Essay" | "Column" | "Analyse";
  title: string;
  excerpt: string;
  reading: string;
  body: string;
  status: ArticleStatus;
  source: ArticleSource;
  sourceUrl: string;
  coverImage: string;
  editorialNote: string;
};

export type Note = {
  id: string;
  date: string;
  text: string;
};

export type ContentStore = {
  articles: Article[];
  notes: Note[];
};

export const contentStore = rawContent as ContentStore;
export const managedArticles = contentStore.articles;
export const publishedArticles = managedArticles.filter((article) => article.status === "published");
export const articles = managedArticles.filter(
  (article) => article.status === "published" || (article.status === "external" && Boolean(article.sourceUrl)),
);
export const notes = contentStore.notes;
