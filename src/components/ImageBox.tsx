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
  fit?: "crop" | "max" | "min" | "fill";
};

export function ImageBox({
  image,
  altFallback,
  className = "",
  width,
  height,
  variant = "light",
  fit = "crop"
}: Props) {
  const resolvedWidth = width ?? image?.width ?? 900;
  const resolvedHeight = height ?? image?.height ?? 600;

  const imageUrl =
    image?.url ??
    (image?.asset && isSanityConfigured
      ? urlFor(image).width(resolvedWidth).height(resolvedHeight).fit(fit).url()
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
      width={resolvedWidth}
      height={resolvedHeight}
      className={className}
    />
  );
}
