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

  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Link href="/work" className="text-sm font-bold text-amber-400 hover:text-amber-300">
            ← Back to work
          </Link>
          <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {project.summary}
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 text-sm text-slate-300 md:grid-cols-4">
            {project.role ? <div><strong className="text-white">Role:</strong><br />{project.role}</div> : null}
            {project.status ? <div><strong className="text-white">Status:</strong><br />{project.status}</div> : null}
            {project.startDate ? <div><strong className="text-white">Started:</strong><br />{formatDate(project.startDate)}</div> : null}
            {project.projectUrl ? (
              <div>
                <strong className="text-white">Link:</strong><br />
                <a href={project.projectUrl} className="text-amber-400" target="_blank" rel="noreferrer">Visit project</a>
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
          className="h-auto w-full rounded-[2rem] object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <PortableContent value={project.description} />

        {project.technologies?.length ? (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-slate-950">Tools & technologies</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {project.galleryImages?.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <h2 className="text-2xl font-black text-slate-950">Project images</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {project.galleryImages.map((image, index) => (
              <ImageBox
                key={index}
                image={image}
                altFallback={`${project.title} image ${index + 1}`}
                className="h-80 w-full rounded-3xl object-cover"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
