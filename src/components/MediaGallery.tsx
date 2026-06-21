"use client";

import { useState } from "react";
import type { ImageWithAlt } from "@/types/content";
import { ImageBox } from "@/components/ImageBox";
import { ImageLightbox } from "@/components/ImageLightbox";

type Props = {
  title?: string;
  images: ImageWithAlt[];
  className?: string;
  imageLabel?: string;
  idPrefix?: string;
};

export function MediaGallery({
  title = "Images",
  images,
  className = "",
  imageLabel = "Image",
  idPrefix = "media-gallery"
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images.length) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const scrollClassName =
    images.length > 4
      ? "media-gallery-scroll media-gallery-scroll--many"
      : "media-gallery-scroll";

  return (
    <>
      <section className={`mx-auto max-w-6xl px-5 pb-20 ${className}`.trim()}>
        <h2 className="text-2xl font-black text-brand-deep">{title}</h2>
        <div className={`${scrollClassName} mt-6`}>
          {images.map((image, index) => (
            <figure
              key={image._key || `${idPrefix}-gallery-${index}`}
              className="media-gallery-item overflow-hidden border border-brand-border-light bg-brand-light"
            >
              <button
                type="button"
                className="media-gallery-trigger"
                aria-label={`View ${imageLabel} image ${index + 1} in full screen`}
                onClick={() => openLightbox(index)}
              >
                <div className="media-gallery-frame">
                  <ImageBox
                    image={image}
                    altFallback={`${imageLabel} image ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    fit="max"
                  />
                </div>
              </button>
              {image.caption ? (
                <figcaption className="border-t border-brand-border-light px-4 py-3 text-sm leading-6 text-brand-body">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
          <div className="media-gallery-scroll-end" aria-hidden="true" />
        </div>
      </section>

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
