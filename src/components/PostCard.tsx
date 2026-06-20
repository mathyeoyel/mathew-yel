import Link from "next/link";
import type { PostCard as PostCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "./ImageBox";

type Props = {
  post: PostCardType;
};

export function PostCard({ post }: Props) {
  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/blog/${post.slug}`}>
        <ImageBox
          image={post.coverImage}
          altFallback={post.title}
          className="h-52 w-full object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          {post.category ? <span>{post.category}</span> : null}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime ? <span>{post.readingTime} min read</span> : null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
          <Link href={`/blog/${post.slug}`} className="hover:text-amber-700">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
