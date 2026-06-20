import Link from "next/link";
import type { ActivityCard as ActivityCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "./ImageBox";

type Props = {
  activity: ActivityCardType;
};

export function ActivityCard({ activity }: Props) {
  return (
    <article className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg md:grid-cols-[220px_1fr]">
      <Link href={`/activities/${activity.slug}`}>
        <ImageBox
          image={activity.coverImage}
          altFallback={activity.title}
          className="h-48 w-full rounded-2xl object-cover md:h-full"
          width={500}
          height={360}
        />
      </Link>
      <div className="p-2">
        <div className="flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide">
          {activity.category ? (
            <span className="text-amber-700">{activity.category}</span>
          ) : null}
          <span className="text-slate-400">{formatDate(activity.activityDate)}</span>
        </div>
        <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">
          <Link href={`/activities/${activity.slug}`} className="hover:text-amber-700">
            {activity.title}
          </Link>
        </h3>
        {activity.location ? (
          <p className="mt-2 text-sm font-semibold text-slate-500">{activity.location}</p>
        ) : null}
        {activity.shortDescription ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {activity.shortDescription}
          </p>
        ) : null}
      </div>
    </article>
  );
}
