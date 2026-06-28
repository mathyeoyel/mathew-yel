import { sanityFetch } from "@/sanity/client";
import { allProjectsQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ProjectCard as ProjectCardType } from "@/types/content";
import { WorkBrowser } from "@/components/WorkBrowser";

export const metadata = {
  title: "Work",
  description:
    "A collection of digital products, websites, platforms, and creative systems I have designed, built, or contributed to."
};

export const revalidate = 60;

async function getProjects() {
  if (!isSanityConfigured) return [];
  return sanityFetch<ProjectCardType[]>(allProjectsQuery);
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 md:py-16">
      <header className="mb-6 md:mb-10">
        <h1 className="text-4xl font-black leading-tight tracking-tight text-brand-deep md:text-6xl">
          Works
        </h1>
      </header>

      {projects.length ? <WorkBrowser projects={projects} /> : (
        <div className="empty-state">
          Add projects in Sanity Studio to fill this page.
        </div>
      )}
    </main>
  );
}
