import Link from "next/link";
import type { ProjectCard as ProjectCardType } from "@/types/content";
import { ImageBox } from "./ImageBox";

type Props = {
  project: ProjectCardType;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: Props) {
  if (compact) {
    return (
      <article className="card flex h-full flex-col overflow-hidden transition hover:border-brand-accent">
        <Link href={`/work/${project.slug}`}>
          <ImageBox
            image={project.coverImage}
            altFallback={project.title}
            className="h-40 w-full object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-2">
            {project.category ? <span className="tag tag-muted">{project.category}</span> : null}
            {project.status ? <span className="tag tag-muted">{project.status}</span> : null}
          </div>
          <h3 className="mt-3 text-base font-black leading-snug tracking-tight text-brand-deep">
            <Link href={`/work/${project.slug}`} className="hover:text-brand-accent">
              {project.title}
            </Link>
          </h3>
          {project.summary ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-body">
              {project.summary}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="card transition hover:border-brand-accent">
      <Link href={`/work/${project.slug}`}>
        <ImageBox
          image={project.coverImage}
          altFallback={project.title}
          className="h-56 w-full object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {project.category ? <span className="tag tag-muted">{project.category}</span> : null}
          {project.status ? <span className="tag tag-muted">{project.status}</span> : null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-brand-deep">
          <Link href={`/work/${project.slug}`} className="hover:text-brand-accent">
            {project.title}
          </Link>
        </h3>
        {project.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-brand-body">
            {project.summary}
          </p>
        ) : null}
        {project.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs font-semibold text-brand-muted">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
