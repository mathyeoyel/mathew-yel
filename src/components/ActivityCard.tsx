import Link from "next/link";
import type { ActivityCard as ActivityCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "./ImageBox";

type Props = {
  activity: ActivityCardType;
  compact?: boolean;
};

export function ActivityCard({ activity, compact = false }: Props) {
  if (compact) {
    return (
      <article className="card flex h-full flex-col overflow-hidden">
        <Link href={`/activities/${activity.slug}`}>
          <ImageBox
            image={activity.coverImage}
            altFallback={activity.title}
            className="h-36 w-full object-cover"
            width={500}
            height={288}
          />
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-2 text-[0.6875rem] font-bold uppercase tracking-wide">
            {activity.category ? (
              <span className="text-brand-accent">{activity.category}</span>
            ) : null}
            <span className="text-brand-muted">{formatDate(activity.activityDate)}</span>
          </div>
          <h3 className="mt-2 text-base font-black leading-snug tracking-tight text-brand-deep">
            <Link href={`/activities/${activity.slug}`} className="hover:text-brand-accent">
              {activity.title}
            </Link>
          </h3>
          {activity.shortDescription ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-body">
              {activity.shortDescription}
            </p>
          ) : null}
        </div>
      </article>
    );
  }

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
