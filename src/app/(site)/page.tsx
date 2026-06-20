import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import {
  featuredAwardsQuery,
  featuredProjectsQuery,
  profileQuery,
  recentActivitiesQuery,
  recentPostsQuery
} from "@/sanity/queries";
import { fallbackProfile } from "@/lib/fallbacks";
import { isSanityConfigured } from "@/sanity/env";
import type { ActivityCard as ActivityCardType, Award, PostCard as PostCardType, Profile, ProjectCard as ProjectCardType } from "@/types/content";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { ActivityCard } from "@/components/ActivityCard";
import { PostCard } from "@/components/PostCard";

async function fetchHomeData() {
  if (!isSanityConfigured) {
    return {
      profile: fallbackProfile,
      projects: [],
      activities: [],
      posts: [],
      awards: []
    };
  }

  const [profile, projects, activities, posts, awards] = await Promise.all([
    sanityFetch<Profile | null>(profileQuery),
    sanityFetch<ProjectCardType[]>(featuredProjectsQuery),
    sanityFetch<ActivityCardType[]>(recentActivitiesQuery),
    sanityFetch<PostCardType[]>(recentPostsQuery),
    sanityFetch<Award[]>(featuredAwardsQuery)
  ]);

  return {
    profile: profile || fallbackProfile,
    projects,
    activities,
    posts,
    awards
  };
}

export default async function HomePage() {
  const { profile, projects, activities, posts, awards } = await fetchHomeData();

  return (
    <main>
      <Hero profile={profile} />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Selected work"
          title="Projects that show the builder behind the brand."
          description="A focused portfolio of products, websites, platforms, and client work."
        />

        {projects.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            Add featured projects in Sanity Studio to show them here.
          </div>
        )}

        <div className="mt-10">
          <Link href="/work" className="font-black text-amber-700 hover:text-amber-800">
            View all projects →
          </Link>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeader
            eyebrow="Recent activities"
            title="A living record of work, community, and milestones."
            description="Back-date activities to the real date they happened and keep your public timeline clean."
          />

          {activities.length ? (
            <div className="grid gap-5">
              {activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-slate-600">
              Add activities in Sanity Studio to build your timeline.
            </div>
          )}

          <div className="mt-10">
            <Link href="/activities" className="font-black text-amber-700 hover:text-amber-800">
              Explore activities →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeader
          eyebrow="Writing"
          title="Notes, lessons, and reflections."
          description="Use the blog for deeper thoughts about design, technology, VikraHub, and creative growth."
        />

        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-600">
            Add blog posts in Sanity Studio when you are ready.
          </div>
        )}
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeader
            eyebrow="Recognition"
            title="Milestones worth remembering."
            description="Awards, leadership roles, invitations, and professional recognition."
          />

          {awards.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {awards.map((award) => (
                <article key={award._id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-black text-amber-400">{award.year}</p>
                  <h3 className="mt-3 text-lg font-black">{award.title}</h3>
                  {award.description ? (
                    <p className="mt-3 text-sm leading-7 text-slate-300">{award.description}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-slate-300">
              Add awards and recognition in Sanity Studio.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
