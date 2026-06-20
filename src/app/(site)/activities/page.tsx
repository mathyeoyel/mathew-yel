import { sanityFetch } from "@/sanity/client";
import { allActivitiesQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ActivityCard as ActivityCardType } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";
import { ActivityCard } from "@/components/ActivityCard";

export const metadata = {
  title: "Activities",
  description: "A timeline of Mathew Yel's activities, events, milestones, and community work."
};

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
        description="Events, forums, awards, VikraHub milestones, UNDP work, and community activities sorted by the real date they happened."
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
