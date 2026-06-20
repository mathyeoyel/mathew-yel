import Link from "next/link";
import type { ActivityCard as ActivityCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "./ImageBox";

type Props = {
  activity: ActivityCardType;
};

export function ActivityCard({ activity }: Props) {
  return (
    <article className="card grid gap-5 p-4 md:grid-cols-[220px_1fr]">
      <Link href={`/activities/${activity.slug}`}>
        <ImageBox
          image={activity.coverImage}
          altFallback={activity.title}
          className="h-48 w-full object-cover md:h-full"
          width={500}
          height={360}
        />
      </Link>
      <div className="p-2">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
          {activity.category ? (
            <span className="text-brand-accent">{activity.category}</span>
          ) : null}
          <span className="text-brand-muted">{formatDate(activity.activityDate)}</span>
        </div>
        <h3 className="mt-3 text-xl font-black tracking-tight text-brand-deep">
          <Link href={`/activities/${activity.slug}`} className="hover:text-brand-accent">
            {activity.title}
          </Link>
        </h3>
        {activity.location ? (
          <p className="mt-2 text-sm font-semibold text-brand-body">{activity.location}</p>
        ) : null}
        {activity.shortDescription ? (
          <p className="mt-3 text-sm leading-7 text-brand-body">
            {activity.shortDescription}
          </p>
        ) : null}
      </div>
    </article>
  );
}
