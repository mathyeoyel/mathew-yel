import Link from "next/link";
import type { ProjectCard as ProjectCardType } from "@/types/content";
import { getProjectDisplayCategories } from "@/lib/workCategories";
import { ImageBox } from "./ImageBox";

type Props = {
  project: ProjectCardType;
  compact?: boolean;
  className?: string;
  clampSummary?: boolean;
  variant?: "default" | "featured-carousel";
  showReadMore?: boolean;
};

const MAX_CATEGORY_CHIPS = 2;

function getProjectYear(startDate?: string): string | null {
  if (!startDate) return null;

  const year = new Date(startDate).getFullYear();
  return Number.isNaN(year) ? null : String(year);
}

function CategoryChips({ project }: { project: ProjectCardType }) {
  const categories = getProjectDisplayCategories(project);
  const visibleCategories = categories.slice(0, MAX_CATEGORY_CHIPS);
  const hiddenCount = categories.length - visibleCategories.length;

  if (!visibleCategories.length) {
    return null;
  }

  return (
    <>
      {visibleCategories.map((category) => (
        <span key={category} className="tag tag-muted">
          {category}
        </span>
      ))}
      {hiddenCount > 0 ? (
        <span className="tag tag-muted">+{hiddenCount} more</span>
      ) : null}
    </>
  );
}

function ProjectMeta({ project }: { project: ProjectCardType }) {
  const year = getProjectYear(project.startDate);

  return (
    <div className="flex flex-wrap gap-2">
      <CategoryChips project={project} />
      {project.status ? <span className="tag tag-muted">{project.status}</span> : null}
      {year ? <span className="tag tag-muted">{year}</span> : null}
    </div>
  );
}

export function ProjectCard({
  project,
  compact = false,
  className = "",
  clampSummary = true,
  variant = "default",
  showReadMore = false
}: Props) {
  if (variant === "featured-carousel") {
    return (
      <article
        className={`card flex flex-col overflow-hidden transition hover:border-brand-accent ${className}`.trim()}
      >
        <Link href={`/work/${project.slug}`}>
          <ImageBox
            image={project.coverImage}
            altFallback={project.title}
            className="h-40 w-full object-cover"
          />
        </Link>
        <div className="flex flex-col p-5">
          <ProjectMeta project={project} />
          <h3 className="mt-3 line-clamp-2 min-h-[3.25rem] text-lg font-black leading-snug tracking-tight text-brand-deep">
            <Link href={`/work/${project.slug}`} className="hover:text-brand-accent">
              {project.title}
            </Link>
          </h3>
          {project.summary ? (
            <p className="mt-1 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-brand-body">
              {project.summary}
            </p>
          ) : null}
          {showReadMore ? (
            <Link
              href={`/work/${project.slug}`}
              className="link-accent mt-4 text-sm font-semibold"
            >
              Read more →
            </Link>
          ) : null}
        </div>
      </article>
    );
  }

  if (compact) {
    return (
      <article
        className={`card flex h-full flex-col overflow-hidden transition hover:border-brand-accent ${className}`.trim()}
      >
        <Link href={`/work/${project.slug}`}>
          <ImageBox
            image={project.coverImage}
            altFallback={project.title}
            className="h-40 w-full object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <ProjectMeta project={project} />
          <h3 className="mt-3 text-base font-black leading-snug tracking-tight text-brand-deep">
            <Link href={`/work/${project.slug}`} className="hover:text-brand-accent">
              {project.title}
            </Link>
          </h3>
          {project.summary ? (
            <p
              className={`mt-2 text-sm leading-6 text-brand-body${clampSummary ? " line-clamp-2" : ""}`}
            >
              {project.summary}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`card flex h-full flex-col transition hover:border-brand-accent ${className}`.trim()}
    >
      <Link href={`/work/${project.slug}`}>
        <ImageBox
          image={project.coverImage}
          altFallback={project.title}
          className="h-52 w-full object-cover md:h-56"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <ProjectMeta project={project} />
        <h3 className="mt-4 text-xl font-black tracking-tight text-brand-deep">
          <Link href={`/work/${project.slug}`} className="hover:text-brand-accent">
            {project.title}
          </Link>
        </h3>
        {project.summary ? (
          <p
            className={`mt-3 text-sm leading-7 text-brand-body${clampSummary ? " line-clamp-3" : ""}`}
          >
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
