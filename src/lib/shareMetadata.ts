import { cache } from "react";
import type { Metadata } from "next";
import { isSanityConfigured, siteUrl } from "@/sanity/env";
import { sanityFetch } from "@/sanity/client";
import { shareFallbacksQuery } from "@/sanity/queries";
import { resolveShareImageUrl } from "@/lib/ogImage";
import type { ImageWithAlt } from "@/types/content";

type ShareFallbacks = {
  profileImage?: ImageWithAlt | null;
  defaultOgImage?: ImageWithAlt | null;
};

type BuildShareMetadataInput = {
  title: string;
  description?: string;
  path: string;
  coverImage?: ImageWithAlt | null;
};

const DEFAULT_DESCRIPTION =
  "Creative technologist, UI/UX designer, and founder of VikraHub.";

const getShareFallbacks = cache(async (): Promise<ShareFallbacks | null> => {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    return (await sanityFetch<ShareFallbacks | null>(shareFallbacksQuery)) || null;
  } catch {
    return null;
  }
});

export async function buildShareMetadata({
  title,
  description,
  path,
  coverImage
}: BuildShareMetadataInput): Promise<Metadata> {
  const fallbacks = await getShareFallbacks();
  const imageUrl = resolveShareImageUrl(coverImage, fallbacks ?? undefined);
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const url = `${siteUrl}${path}`;

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description: pageDescription,
      url,
      siteName: "Mathew Yel",
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: title }]
        : [],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
      images: imageUrl ? [imageUrl] : []
    }
  };
}

export function buildSharePageUrl(path: string): string {
  return `${siteUrl}${path}`;
}
