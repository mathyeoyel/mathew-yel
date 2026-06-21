import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { ImageWithAlt } from "@/types/content";
import { isSanityConfigured } from "@/sanity/env";
import { hasImage } from "@/lib/image";

type Props = {
  image?: ImageWithAlt;
  altFallback: string;
  className?: string;
  width?: number;
  height?: number;
  variant?: "light" | "dark";
  fit?: "crop" | "max" | "min" | "fill";
  hideIfMissing?: boolean;
};

function resolveImageUrl(
  image: ImageWithAlt,
  width: number,
  height: number,
  fit: "crop" | "max" | "min" | "fill"
) {
  if (image.url) {
    return image.url;
  }

  const asset = image.asset as { url?: string } | undefined;
  if (asset?.url) {
    return asset.url;
  }

  if (image.asset && isSanityConfigured) {
    return urlFor(image).width(width).height(height).fit(fit).url();
  }

  return null;
}

export function ImageBox({
  image,
  altFallback,
  className = "",
  width,
  height,
  variant = "light",
  fit = "crop",
  hideIfMissing = false
}: Props) {
  if (!hasImage(image)) {
    if (hideIfMissing) return null;

    return (
      <div
        className={`image-placeholder min-h-56 ${variant === "dark" ? "image-placeholder-dark" : ""} ${className}`}
      >
        Image will appear here
      </div>
    );
  }

  const resolvedWidth = width ?? image?.width ?? 900;
  const resolvedHeight = height ?? image?.height ?? 600;
  const imageUrl = resolveImageUrl(image!, resolvedWidth, resolvedHeight, fit);

  if (!imageUrl) {
    if (hideIfMissing) return null;

    return (
      <div
        className={`image-placeholder min-h-56 ${variant === "dark" ? "image-placeholder-dark" : ""} ${className}`}
      >
        Image will appear here
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={image?.alt || altFallback}
      width={resolvedWidth}
      height={resolvedHeight}
      className={className}
    />
  );
}
