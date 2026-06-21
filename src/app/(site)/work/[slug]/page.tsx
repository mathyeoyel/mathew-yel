import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { projectBySlugQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ProjectDetail } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "@/components/ImageBox";
import { PortableContent } from "@/components/PortableContent";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  if (!isSanityConfigured) return null;
  return sanityFetch<ProjectDetail | null>(projectBySlugQuery, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.summary
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const galleryImages =
    project.galleryImages?.filter((image) => Boolean(image?.url || image?.asset)) ?? [];

  return (
    <main>
      <section className="page-hero-dark">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Link href="/work" className="link-accent-on-dark text-sm">
            ← Back to work
          </Link>
          <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted">
              {project.summary}
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 text-sm text-brand-muted md:grid-cols-4">
            {project.role ? (
              <div>
                <strong className="text-white">Role:</strong>
                <br />
                {project.role}
              </div>
            ) : null}
            {project.status ? (
              <div>
                <strong className="text-white">Status:</strong>
                <br />
                {project.status}
              </div>
            ) : null}
            {project.startDate ? (
              <div>
                <strong className="text-white">Started:</strong>
                <br />
                {formatDate(project.startDate)}
              </div>
            ) : null}
            {project.projectUrl ? (
              <div>
                <strong className="text-white">Link:</strong>
                <br />
                <a
                  href={project.projectUrl}
                  className="text-brand-accent"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit project
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <ImageBox
          image={project.coverImage}
          altFallback={project.title}
          width={1400}
          height={800}
          className="h-auto w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <PortableContent value={project.description} />

        {project.technologies?.length ? (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-brand-deep">Tools & technologies</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="tag tag-muted">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {galleryImages.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <h2 className="text-2xl font-black text-brand-deep">Project images</h2>
          <div className="project-gallery-scroll mt-6 flex gap-4 overflow-x-auto overscroll-x-contain pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
            {galleryImages.map((image, index) => (
              <figure
                key={image._key || `${project._id}-gallery-${index}`}
                className="project-gallery-item min-w-[82%] flex-shrink-0 overflow-hidden border border-brand-border-light bg-brand-light md:min-w-0"
              >
                <div className="flex min-h-[220px] items-center justify-center p-4 md:min-h-[240px]">
                  <ImageBox
                    image={image}
                    altFallback={`${project.title} image ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    fit="max"
                    className="max-h-[360px] w-full object-contain md:max-h-[480px]"
                  />
                </div>
                {image.caption ? (
                  <figcaption className="border-t border-brand-border-light px-4 py-3 text-sm leading-6 text-brand-body">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
            <div className="min-w-3 flex-shrink-0 md:hidden" aria-hidden="true" />
          </div>
        </section>
      ) : null}
    </main>
  );
}
