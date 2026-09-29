import images from "../article-title-images.json";
import projectImages from "../project-title-images.json";
import type { Article } from "../content";

type TitleImage = { src: string; width: number; height: number; lines: number };

export function ArticleTitle({ article }: { article: Article }) {
  const image = (images as Record<string, TitleImage>)[article.slug];
  return <HandwrittenTitle title={article.title} image={image} />;
}

export function ProjectTitle({ project }: { project: { title: string; href: string } }) {
  const image = (projectImages as Record<string, TitleImage>)[project.href];
  return <HandwrittenTitle title={project.title} image={image} />;
}

function HandwrittenTitle({ title, image }: { title: string; image?: TitleImage }) {
  if (!image) return title;

  return (
    <img
      className={`article-title-image article-title-image--${image.lines}`}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={title}
      loading="lazy"
      decoding="async"
    />
  );
}
