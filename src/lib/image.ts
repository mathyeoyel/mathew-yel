import type { ImageWithAlt } from "@/types/content";

export function hasImage(image?: ImageWithAlt | null): boolean {
  if (!image) return false;
  if (image.url) return true;

  const asset = image.asset as { _ref?: string; url?: string } | undefined;
  if (!asset) return false;

  return Boolean(asset._ref || asset.url);
}
