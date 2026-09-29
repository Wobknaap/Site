import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import projects from "../projects-data.json";

export const metadata: Metadata = {
  title: "Persoonlijke projecten · Wob Knaap",
  description: "Eigen projecten en onderzoek met data, taal en technologie.",
};

export default function ProjectsPage() {
  return <main id="top">
    <SiteHeader active="projecten" />
    <header className="page-intro projects-intro page-wrap">
      <p className="eyebrow">Data · taal · technologie</p>
      <h1>Persoonlijke projecten</h1>
    </header>
    <section className="project-grid page-wrap" aria-label="Projecten">
      {projects.map((project) => <article className="project-card" key={project.title}>
        <p className="eyebrow">{project.category}</p>
        <h2><a href={project.href}>{project.title}</a></h2>
        <p>{project.description}</p>
        <div className="article-tags">{project.tags.map(tag => <span className="article-tag" key={tag}>{tag}</span>)}</div>
        <a className="underlined-link archive-link" href={project.href}>{project.href.startsWith("https:") ? "Bekijk op GitHub ↗" : "Bekijk het project ↗"}</a>
      </article>)}
    </section>
    <SiteFooter />
  </main>;
}
