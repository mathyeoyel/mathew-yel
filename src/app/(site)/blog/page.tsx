import { sanityFetch } from "@/sanity/client";
import { allPostsQuery } from "@/sanity/queries";
import { isSanityConfigured } from "@/sanity/env";
import type { PostCard as PostCardType } from "@/types/content";
import { SectionHeader } from "@/components/SectionHeader";
import { PostCard } from "@/components/PostCard";

export const metadata = {
  title: "Blog",
  description:
    "Reflections on design, technology, creativity, personal growth, and the lessons I am learning while building from South Sudan."
};

export const revalidate = 60;

async function getPosts() {
  if (!isSanityConfigured) return [];
  return sanityFetch<PostCardType[]>(allPostsQuery);
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="mx-auto max-w-6xl px-5 py-20">
      <SectionHeader
        eyebrow="Blog"
        title="Writing and reflections."
        description="Reflections on design, technology, creativity, personal growth, and the lessons I am learning while building from South Sudan."
      />

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Add published blog posts in Sanity Studio.
        </div>
      )}
    </main>
  );
}
