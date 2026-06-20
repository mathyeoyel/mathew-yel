import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sanityFetch } from "@/sanity/client";
import { postBySlugQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { PostDetail } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "@/components/ImageBox";
import { PortableContent } from "@/components/PortableContent";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string) {
  if (!isSanityConfigured) return null;
  return sanityFetch<PostDetail | null>(postBySlugQuery, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post not found"
    };
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <Link href="/blog" className="link-accent text-sm">
          ← Back to blog
        </Link>
        <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-brand-muted">
          {post.category ? <span>{post.category}</span> : null}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime ? <span>{post.readingTime} min read</span> : null}
        </div>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-brand-deep md:text-6xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="mt-6 text-lg leading-8 text-brand-body">{post.excerpt}</p>
        ) : null}
      </section>

      <section className="mx-auto max-w-5xl px-5">
        <ImageBox
          image={post.coverImage}
          altFallback={post.title}
          width={1400}
          height={800}
          className="h-auto w-full object-cover"
        />
      </section>

      <section className="mx-auto max-w-3xl px-5 py-14">
        <PortableContent value={post.content} />
      </section>
    </main>
  );
}
