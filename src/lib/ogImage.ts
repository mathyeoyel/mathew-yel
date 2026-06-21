import { urlFor } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import { hasImage } from "@/lib/image";
import type { ImageWithAlt } from "@/types/content";

type ShareImageFallbacks = {
  profileImage?: ImageWithAlt | null;
  defaultOgImage?: ImageWithAlt | null;
};

export function resolveImageUrl(
  image?: ImageWithAlt | null,
  width = 1200,
  height = 630
): string | undefined {
  if (!hasImage(image) || !image) {
    return undefined;
  }

  if (image.url) {
    return image.url;
  }

  const asset = image.asset as { url?: string } | undefined;
  if (asset?.url) {
    return asset.url;
  }

  if (image.asset && isSanityConfigured) {
    return urlFor(image).width(width).height(height).fit("crop").url();
  }

  return undefined;
}

export function resolveShareImageUrl(
  primary?: ImageWithAlt | null,
  fallbacks?: ShareImageFallbacks
): string | undefined {
  return (
    resolveImageUrl(primary) ||
    resolveImageUrl(fallbacks?.profileImage) ||
    resolveImageUrl(fallbacks?.defaultOgImage)
  );
}
