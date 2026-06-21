import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { activityBySlugQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { ActivityDetail } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { filterValidImages } from "@/lib/image";
import { buildShareMetadata, buildSharePageUrl } from "@/lib/shareMetadata";
import { ImageBox } from "@/components/ImageBox";
import { PortableContent } from "@/components/PortableContent";
import { MediaGallery } from "@/components/MediaGallery";
import { ShareButtons } from "@/components/ShareButtons";

export const revalidate = 60;

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

  return buildShareMetadata({
    title: activity.seo?.title || activity.title,
    description: activity.seo?.description || activity.shortDescription,
    path: `/activities/${activity.slug}`,
    coverImage: activity.coverImage
  });
}

export default async function ActivityDetailPage({ params }: Props) {
  const { slug } = await params;
  const activity = await getActivity(slug);

  if (!activity) notFound();

  const galleryImages = filterValidImages(activity.galleryImages);
  const shareUrl = buildSharePageUrl(`/activities/${activity.slug}`);

  return (
    <main>
      <section className="page-hero-dark">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Link href="/activities" className="link-accent-on-dark text-sm">
            ← Back to activities
          </Link>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-black uppercase tracking-wide">
            {activity.category ? <span className="text-brand-accent">{activity.category}</span> : null}
            <span className="text-brand-muted">{formatDate(activity.activityDate)}</span>
            {activity.location ? <span className="text-brand-muted">{activity.location}</span> : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {activity.title}
          </h1>
          {activity.shortDescription ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted">
              {activity.shortDescription}
            </p>
          ) : null}
          <ShareButtons
            title={activity.title}
            url={shareUrl}
            description={activity.shortDescription}
            variant="dark"
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <ImageBox
          image={activity.coverImage}
          altFallback={activity.title}
          width={1400}
          height={800}
          className="h-auto w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <PortableContent value={activity.content} />

        {activity.relatedProject ? (
          <div className="mt-12 border border-brand-border-light bg-brand-light p-6">
            <p className="eyebrow tracking-wide">Related project</p>
            <h2 className="mt-2 text-xl font-black text-brand-deep">
              <Link href={`/work/${activity.relatedProject.slug}`} className="hover:text-brand-accent">
                {activity.relatedProject.title}
              </Link>
            </h2>
            {activity.relatedProject.summary ? (
              <p className="mt-2 text-sm leading-7 text-brand-body">
                {activity.relatedProject.summary}
              </p>
            ) : null}
          </div>
        ) : null}

        <ShareButtons
          title={activity.title}
          url={shareUrl}
          description={activity.shortDescription}
          variant="light"
          className="mt-12"
        />
      </section>

      <MediaGallery
        title="More images"
        images={galleryImages}
        idPrefix={activity._id}
        imageLabel={activity.title}
      />
    </main>
  );
}
