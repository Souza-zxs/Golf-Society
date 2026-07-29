import Link from "next/link";
import { BlogPost } from "@/lib/api";
import { formatPublishedDate } from "@/lib/format";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
      <div className="aspect-[4/3] overflow-hidden border border-ink/10 bg-ivory-2 transition-colors duration-300 group-hover:border-gold/40">
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl italic text-stone/40">SSG</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="font-data text-[10px] uppercase tracking-[0.2em] text-stone">
          {post.published_at ? formatPublishedDate(post.published_at) : ""}
          {post.blog_categories ? ` · ${post.blog_categories.name}` : ""}
        </span>
        <h3 className="font-display text-xl leading-snug text-ink transition-colors duration-300 group-hover:text-gold">
          {post.title}
        </h3>
        {post.excerpt ? <p className="line-clamp-2 text-sm leading-relaxed text-stone">{post.excerpt}</p> : null}
      </div>
    </Link>
  );
}
