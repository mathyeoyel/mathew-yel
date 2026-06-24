import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import { ImageBox } from "@/components/ImageBox";

type Props = {
  value?: PortableTextBlock[];
};

type PortableImageValue = {
  asset?: unknown;
  alt?: string;
  caption?: string;
};

function getPortableImageDimensions(value: PortableImageValue) {
  const asset = value.asset as
    | {
        metadata?: { dimensions?: { width?: number; height?: number } };
      }
    | undefined;

  const width = asset?.metadata?.dimensions?.width ?? 1200;
  const height = asset?.metadata?.dimensions?.height ?? Math.round(width * 0.75);

  return { width, height };
}

export function PortableContent({ value }: Props) {
  if (!value?.length) return null;

  return (
    <div className="prose-content">
      <PortableText
        value={value}
        components={{
          types: {
            image: ({ value }) => {
              if (!value?.asset) return null;

              const { width, height } = getPortableImageDimensions(value);

              return (
                <figure className="portable-image">
                  <div className="portable-image-frame">
                    <ImageBox
                      image={{
                        asset: value.asset,
                        alt: value.alt,
                        width,
                        height
                      }}
                      altFallback="Case study image"
                      width={width}
                      height={height}
                      fit="max"
                      className="portable-image__img"
                    />
                  </div>
                  {value.caption ? (
                    <figcaption className="portable-image-caption">{value.caption}</figcaption>
                  ) : null}
                </figure>
              );
            }
          },
          block: {
            h2: ({ children }) => (
              <h2 className="mt-10 text-2xl font-bold tracking-tight text-brand-deep">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-8 text-xl font-bold tracking-tight text-brand-deep">
                {children}
              </h3>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-8 border-l-4 border-brand-accent pl-5 text-lg font-medium text-brand-body">
                {children}
              </blockquote>
            ),
            normal: ({ children }) => (
              <p className="mt-5 text-base leading-8 text-brand-body">{children}</p>
            )
          },
          list: {
            bullet: ({ children }) => (
              <ul className="mt-5 list-disc space-y-2 pl-6 text-brand-body">{children}</ul>
            ),
            number: ({ children }) => (
              <ol className="mt-5 list-decimal space-y-2 pl-6 text-brand-body">{children}</ol>
            )
          },
          marks: {
            link: ({ value, children }) => (
              <a
                href={value?.href}
                className="font-semibold text-brand-deep underline decoration-brand-accent underline-offset-4"
                target={value?.href?.startsWith("http") ? "_blank" : undefined}
                rel={value?.href?.startsWith("http") ? "noreferrer" : undefined}
              >
                {children}
              </a>
            )
          }
        }}
      />
    </div>
  );
}
