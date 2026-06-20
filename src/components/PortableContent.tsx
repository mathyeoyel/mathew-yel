import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

type Props = {
  value?: PortableTextBlock[];
};

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
              return (
                <figure className="my-8 overflow-hidden border border-brand-border-light bg-white">
                  <Image
                    src={urlFor(value).width(1200).height(700).fit("crop").url()}
                    alt={value.alt || ""}
                    width={1200}
                    height={700}
                    className="h-auto w-full object-cover"
                  />
                  {value.caption ? (
                    <figcaption className="px-4 py-3 text-sm text-brand-body">
                      {value.caption}
                    </figcaption>
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
