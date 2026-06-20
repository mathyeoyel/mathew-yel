import Link from "next/link";
import type { ProjectCard as ProjectCardType } from "@/types/content";
import { ImageBox } from "./ImageBox";

type Props = {
  project: ProjectCardType;
};

export function ProjectCard({ project }: Props) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/work/${project.slug}`}>
        <ImageBox
          image={project.coverImage}
          altFallback={project.title}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {project.category ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
              {project.category}
            </span>
          ) : null}
          {project.status ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {project.status}
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
          <Link href={`/work/${project.slug}`} className="hover:text-amber-700">
            {project.title}
          </Link>
        </h3>
        {project.summary ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
            {project.summary}
          </p>
        ) : null}
        {project.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs font-semibold text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
