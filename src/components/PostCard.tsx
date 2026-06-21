import Link from "next/link";
import type { PostCard as PostCardType } from "@/types/content";
import { formatDate } from "@/lib/formatDate";
import { hasImage } from "@/lib/image";
import { ImageBox } from "./ImageBox";

type Props = {
  post: PostCardType;
  compact?: boolean;
};

function PostCoverImage({
  post,
  compact = false
}: {
  post: PostCardType;
  compact?: boolean;
}) {
  if (!hasImage(post.coverImage)) {
    return null;
  }

  return (
    <Link href={`/blog/${post.slug}`} className="block bg-brand-light">
      <div className={compact ? "post-cover-frame post-cover-frame--compact" : "post-cover-frame post-cover-frame--card"}>
        <ImageBox
          image={post.coverImage}
          altFallback={post.title}
          width={post.coverImage?.width}
          height={post.coverImage?.height}
          fit="max"
          className="max-h-full w-full object-contain"
        />
      </div>
    </Link>
  );
}

export function PostCard({ post, compact = false }: Props) {
  if (compact) {
    return (
      <article className="card flex h-full flex-col overflow-hidden">
        <PostCoverImage post={post} compact />
        <div className="flex flex-1 flex-col p-4">
          <div className="flex flex-wrap gap-2 text-[0.6875rem] font-bold uppercase tracking-wide text-brand-muted">
            {post.category ? <span>{post.category}</span> : null}
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h3 className="mt-2 text-base font-black leading-snug tracking-tight text-brand-deep">
            <Link href={`/blog/${post.slug}`} className="hover:text-brand-accent">
              {post.title}
            </Link>
          </h3>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-brand-body">{post.excerpt}</p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article className="card overflow-hidden">
      <PostCoverImage post={post} />
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
