import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { activityBySlugQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ActivityDetail } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "@/components/ImageBox";
import { PortableContent } from "@/components/PortableContent";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getActivity(slug: string) {
  if (!isSanityConfigured) return null;
  return sanityFetch<ActivityDetail | null>(activityBySlugQuery, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivity(slug);

  if (!activity) {
    return {
      title: "Activity not found"
    };
  }

  return {
    title: activity.seo?.title || activity.title,
    description: activity.seo?.description || activity.shortDescription
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  const activity = await getActivity(slug);

  if (!activity) notFound();

  return (
    <main>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Link href="/activities" className="text-sm font-bold text-amber-400 hover:text-amber-300">
            ← Back to activities
          </Link>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-black uppercase tracking-wide">
            {activity.category ? <span className="text-amber-400">{activity.category}</span> : null}
            <span className="text-slate-400">{formatDate(activity.activityDate)}</span>
            {activity.location ? <span className="text-slate-400">{activity.location}</span> : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {activity.title}
          </h1>
          {activity.shortDescription ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {activity.shortDescription}
            </p>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <ImageBox
          image={activity.coverImage}
          altFallback={activity.title}
          width={1400}
          height={800}
          className="h-auto w-full rounded-[2rem] object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <PortableContent value={activity.content} />

        {activity.relatedProject ? (
          <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-black uppercase tracking-wide text-amber-700">Related project</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">
              <Link href={`/work/${activity.relatedProject.slug}`}>{activity.relatedProject.title}</Link>
            </h2>
            {activity.relatedProject.summary ? (
              <p className="mt-2 text-sm leading-7 text-slate-700">{activity.relatedProject.summary}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      {activity.galleryImages?.length ? (
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <h2 className="text-2xl font-black text-slate-950">More images</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {activity.galleryImages.map((image, index) => (
              <ImageBox
                key={index}
                image={image}
                altFallback={`${activity.title} image ${index + 1}`}
                className="h-80 w-full rounded-3xl object-cover"
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
