import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import {
  featuredAwardsQuery,
  homepageActivitiesQuery,
  homepageProjectsQuery,
  profileQuery,
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

export const revalidate = 60;

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
    sanityFetch<ProjectCardType[]>(homepageProjectsQuery),
    sanityFetch<ActivityCardType[]>(homepageActivitiesQuery),
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

      <section className="home-section home-section--soft">
        <div className="home-section-inner">
          <SectionHeader
            eyebrow="Journey"
            title="Featured Activities"
            description="Recent moments from my journey — from product milestones and events to leadership, learning, and community work."
          />

          {activities.length ? (
            <div className="home-scroll-row home-scroll-row--cols-3">
              {activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} compact />
              ))}
              <div className="home-scroll-row-end md:hidden" aria-hidden="true" />
            </div>
          ) : (
            <div className="empty-state bg-white">
              Enable Show on homepage for activities in Sanity Studio to feature them here.
            </div>
          )}

          <div className="home-section-footer">
            <Link href="/activities" className="link-accent">
              Explore activities →
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--white">
        <div className="home-section-inner">
          <SectionHeader
            eyebrow="Work"
            title="Selected Projects"
            description="Selected projects that reflect my work across design, technology, community platforms, and digital products."
          />

          {projects.length ? (
            <div className="home-scroll-row home-scroll-row--cols-3">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project._id} project={project} compact />
              ))}
              <div className="home-scroll-row-end md:hidden" aria-hidden="true" />
            </div>
          ) : (
            <div className="empty-state">
              Enable Show on homepage for up to 3 projects in Sanity Studio to feature them here.
            </div>
          )}

          <div className="home-section-footer">
            <Link href="/work" className="link-accent">
              View all projects →
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--soft">
        <div className="home-section-inner">
          <SectionHeader
            eyebrow="Writing"
            title="Notes, lessons, and reflections."
            description="Thoughts, lessons, and reflections from building, designing, and growing as a creative technologist."
          />

          {posts.length ? (
            <div className="home-scroll-row home-scroll-row--cols-3">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} compact />
              ))}
              <div className="home-scroll-row-end md:hidden" aria-hidden="true" />
            </div>
          ) : (
            <div className="empty-state bg-white">
              Add blog posts in Sanity Studio when you are ready.
            </div>
          )}

          <div className="home-section-footer">
            <Link href="/blog" className="link-accent">
              Read all posts →
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-section--dark">
        <div className="home-section-inner">
          <SectionHeader
            tone="dark"
            eyebrow="Recognition"
            title="Milestones worth remembering."
            description="Recognition, leadership roles, and milestones that continue to shape my creative and professional journey."
          />

          {awards.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {awards.map((award) => (
                <article key={award._id} className="card-dark p-6">
                  <p className="text-sm font-black text-brand-accent">{award.year}</p>
                  <h3 className="mt-3 text-lg font-black">{award.title}</h3>
                  {award.description ? (
                    <p className="mt-3 text-sm leading-7 text-brand-muted">{award.description}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state-dark">
              Add awards and recognition in Sanity Studio.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
