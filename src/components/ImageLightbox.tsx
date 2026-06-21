"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { urlFor } from "@/sanity/image";
import { isSanityConfigured } from "@/sanity/env";
import type { ImageWithAlt } from "@/types/content";

type Props = {
  images: ImageWithAlt[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
};

function getImageUrl(image: ImageWithAlt) {
  const width = image.width ?? 1600;
  const height = image.height ?? 1200;

  return (
    image.url ??
    (image.asset && isSanityConfigured
      ? urlFor(image).width(width).height(height).fit("max").url()
      : null)
  );
}

export function ImageLightbox({ images, initialIndex, open, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    setActiveIndex(initialIndex);
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft" && images.length > 1) {
        goPrev();
      } else if (event.key === "ArrowRight" && images.length > 1) {
        goNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goPrev, goNext, images.length]);

  if (!open || !images.length) {
    return null;
  }

  const current = images[activeIndex];
  const imageUrl = current ? getImageUrl(current) : null;
  const resolvedWidth = current?.width ?? 1600;
  const resolvedHeight = current?.height ?? 1200;
  const alt = current?.alt || `Image ${activeIndex + 1}`;

  return (
    <div
      className="image-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <div className="image-lightbox-toolbar">
        {images.length > 1 ? (
          <p className="image-lightbox-count" aria-live="polite">
            {activeIndex + 1} / {images.length}
          </p>
        ) : (
          <span />
        )}
        <button
          ref={closeButtonRef}
          type="button"
          className="image-lightbox-control"
          aria-label="Close image viewer"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="image-lightbox-stage" onClick={(event) => event.stopPropagation()}>
        {images.length > 1 ? (
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-nav-prev"
            aria-label="Previous image"
            onClick={goPrev}
          >
            Prev
          </button>
        ) : null}

        <div className="image-lightbox-frame">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={alt}
              width={resolvedWidth}
              height={resolvedHeight}
              className="image-lightbox-image"
              priority
            />
          ) : null}
          {current?.caption ? (
            <p className="image-lightbox-caption">{current.caption}</p>
          ) : null}
        </div>

        {images.length > 1 ? (
          <button
            type="button"
            className="image-lightbox-nav image-lightbox-nav-next"
            aria-label="Next image"
            onClick={goNext}
          >
            Next
          </button>
        ) : null}
      </div>
    </div>
  );
}
