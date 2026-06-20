import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { ImageWithAlt } from "@/types/content";
import { isSanityConfigured } from "@/sanity/env";

type Props = {
  image?: ImageWithAlt;
  altFallback: string;
  className?: string;
  width?: number;
  height?: number;
  variant?: "light" | "dark";
};

export function ImageBox({
  image,
  altFallback,
  className = "",
  width = 900,
  height = 600,
  variant = "light"
}: Props) {
  const imageUrl =
    image?.url ??
    (image?.asset && isSanityConfigured
      ? urlFor(image).width(width).height(height).fit("crop").url()
      : null);

  if (!imageUrl) {
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
      width={width}
      height={height}
      className={className}
    />
  );
}
