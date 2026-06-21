"use client";

import { useState } from "react";
import type { ImageWithAlt } from "@/types/content";
import { ImageBox } from "@/components/ImageBox";
import { ImageLightbox } from "@/components/ImageLightbox";

type Props = {
  images: ImageWithAlt[];
  projectId: string;
  projectTitle: string;
};

export function ProjectGallery({ images, projectId, projectTitle }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-2xl font-black text-brand-deep">Project images</h2>
        <div className="project-gallery-scroll mt-6 flex gap-4 overflow-x-auto overscroll-x-contain pb-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0">
          {images.map((image, index) => (
            <figure
              key={image._key || `${projectId}-gallery-${index}`}
              className="project-gallery-item min-w-[82%] flex-shrink-0 overflow-hidden border border-brand-border-light bg-brand-light md:min-w-0"
            >
              <button
                type="button"
                className="project-gallery-trigger"
                aria-label={`View ${projectTitle} image ${index + 1} in full screen`}
                onClick={() => openLightbox(index)}
              >
                <div className="flex min-h-[220px] items-center justify-center p-4 md:min-h-[240px]">
                  <ImageBox
                    image={image}
                    altFallback={`${projectTitle} image ${index + 1}`}
                    width={image.width}
                    height={image.height}
                    fit="max"
                    className="max-h-[360px] w-full object-contain md:max-h-[480px]"
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
          <div className="min-w-3 flex-shrink-0 md:hidden" aria-hidden="true" />
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
