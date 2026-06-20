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
};

export function ImageBox({
  image,
  altFallback,
  className = "",
  width = 900,
  height = 600
}: Props) {
  const imageUrl =
    image?.url ??
    (image?.asset && isSanityConfigured
      ? urlFor(image).width(width).height(height).fit("crop").url()
      : null);

  if (!imageUrl) {
    return (
      <div className={`flex min-h-56 items-center justify-center bg-slate-100 text-sm text-slate-500 ${className}`}>
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
