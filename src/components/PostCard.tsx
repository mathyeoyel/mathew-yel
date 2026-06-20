import Link from "next/link";
import type { PostCard as PostCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { ImageBox } from "./ImageBox";

type Props = {
  post: PostCardType;
};

export function PostCard({ post }: Props) {
  return (
    <article className="card">
      <Link href={`/blog/${post.slug}`}>
        <ImageBox
          image={post.coverImage}
          altFallback={post.title}
          className="h-52 w-full object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-brand-muted">
          {post.category ? <span>{post.category}</span> : null}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readingTime ? <span>{post.readingTime} min read</span> : null}
        </div>
        <h3 className="mt-4 text-xl font-black tracking-tight text-brand-deep">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-accent">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-3 text-sm leading-7 text-brand-body">{post.excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
