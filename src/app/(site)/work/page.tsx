import { sanityFetch } from "@/sanity/client";
import { allProjectsQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ProjectCard as ProjectCardType } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";
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
    <main className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Work"
        title="Projects and case studies."
        description="A collection of digital products, websites, platforms, and creative systems I have designed, built, or contributed to."
      />

      {projects.length ? <WorkBrowser projects={projects} /> : (
        <div className="empty-state">
          Add projects in Sanity Studio to fill this page.
        </div>
      )}
    </main>
  );
}
