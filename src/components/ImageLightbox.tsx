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

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;
const TOGGLE_ZOOM = 2;

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

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));
}

export function ImageLightbox({ images, initialIndex, open, onClose }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const didPanRef = useRef(false);

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragStartRef.current = null;
    didPanRef.current = false;
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((current) => clampZoom(current + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((current) => {
      const next = clampZoom(current - ZOOM_STEP);
      if (next === MIN_ZOOM) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    resetView();
  }, [resetView]);

  const toggleZoom = useCallback(() => {
    setZoom((current) => (current === MIN_ZOOM ? TOGGLE_ZOOM : MIN_ZOOM));
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!open) return;

    setActiveIndex(initialIndex);
    resetView();
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, initialIndex, resetView]);

  useEffect(() => {
    resetView();
  }, [activeIndex, resetView]);

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
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn();
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomOut();
      } else if (event.key === "0") {
        event.preventDefault();
        resetZoom();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goPrev, goNext, images.length, zoomIn, zoomOut, resetZoom]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (event.deltaY < 0) {
        zoomIn();
      } else if (event.deltaY > 0) {
        zoomOut();
      }
    },
    [zoomIn, zoomOut]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (zoom <= MIN_ZOOM) return;

      didPanRef.current = false;
      setIsDragging(true);
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [pan.x, pan.y, zoom]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStartRef.current || zoom <= MIN_ZOOM) return;

      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        didPanRef.current = true;
      }

      setPan({
        x: dragStartRef.current.panX + deltaX,
        y: dragStartRef.current.panY + deltaY
      });
    },
    [zoom]
  );

  const endPointerInteraction = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartRef.current = null;
    setIsDragging(false);
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const shouldToggle = !didPanRef.current;
      endPointerInteraction(event);

      if (shouldToggle) {
        toggleZoom();
      }

      didPanRef.current = false;
    },
    [endPointerInteraction, toggleZoom]
  );

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
      <div className="image-lightbox-toolbar" onClick={(event) => event.stopPropagation()}>
        <div className="image-lightbox-toolbar-start">
          {images.length > 1 ? (
            <p className="image-lightbox-count" aria-live="polite">
              {activeIndex + 1} / {images.length}
            </p>
          ) : (
            <span className="image-lightbox-count" aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
          )}
        </div>

        <div className="image-lightbox-zoom-controls" aria-label="Zoom controls">
          <button
            type="button"
            className="image-lightbox-control"
            aria-label="Zoom out"
            disabled={zoom <= MIN_ZOOM}
            onClick={zoomOut}
          >
            −
          </button>
          <button
            type="button"
            className="image-lightbox-control"
            aria-label="Reset zoom"
            onClick={resetZoom}
          >
            1:1
          </button>
          <button
            type="button"
            className="image-lightbox-control"
            aria-label="Zoom in"
            disabled={zoom >= MAX_ZOOM}
            onClick={zoomIn}
          >
            +
          </button>
        </div>

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
          <div
            ref={viewportRef}
            className={`image-lightbox-viewport${zoom > MIN_ZOOM ? " is-zoomed" : ""}${isDragging ? " is-dragging" : ""}`}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className={`image-lightbox-transform${isDragging ? " is-dragging" : ""}`}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`
              }}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={alt}
                  width={resolvedWidth}
                  height={resolvedHeight}
                  className="image-lightbox-image"
                  draggable={false}
                  priority
                />
              ) : null}
            </div>
          </div>

          {images.length > 1 ? (
            <p className="image-lightbox-zoom-level" aria-live="polite">
              {Math.round(zoom * 100)}%
            </p>
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
