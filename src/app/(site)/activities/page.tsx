import { sanityFetch } from "@/sanity/client";
import { allActivitiesQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ActivityCard as ActivityCardType } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";
import { ActivityCard } from "@/components/ActivityCard";

export const metadata = {
  title: "Activities",
  description:
    "A living record of the moments, milestones, events, and community experiences shaping my journey in creative technology, leadership, and impact."
};

export const revalidate = 60;

async function getActivities() {
  if (!isSanityConfigured) return [];
  return sanityFetch<ActivityCardType[]>(allActivitiesQuery);
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Activities"
        title="The journey, documented."
        description="A living record of the moments, milestones, events, and community experiences shaping my journey in creative technology, leadership, and impact."
      />

      {activities.length ? (
        <div className="grid gap-5">
          {activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Add activities in Sanity Studio. Remember: use activityDate for back-dated public updates.
        </div>
      )}
    </main>
  );
}
