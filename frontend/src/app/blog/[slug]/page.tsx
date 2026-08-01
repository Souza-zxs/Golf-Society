import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { formatPublishedDate } from "@/lib/format";
import { Reveal } from "@/components/motion/reveal";
import { ArticleBody } from "@/components/content/article-body";
import { api, ApiError, BlogPost } from "@/lib/api";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await api.blog.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Conteúdo" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-ivory py-20 sm:py-28">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="font-data text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
        >
          ← Voltar ao Conteúdo
        </Link>

        <Reveal delay={80} className="mt-8">
          <Eyebrow tone="light">
            {post.published_at ? formatPublishedDate(post.published_at) : "Conteúdo"}
            {post.blog_categories ? ` · ${post.blog_categories.name}` : ""}
          </Eyebrow>
          <h1 className="font-display mt-5 text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>
          {post.author_name ? (
            <p className="font-data mt-5 text-xs uppercase tracking-[0.18em] text-stone">
              Por {post.author_name}
            </p>
          ) : null}
        </Reveal>

        {post.cover_image_url ? (
          <Reveal delay={160}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt=""
              className="mt-10 aspect-video w-full border border-ink/10 object-cover"
            />
          </Reveal>
        ) : null}

        <Reveal delay={240} className="mt-10">
          <ArticleBody content={post.content} />
        </Reveal>
      </Container>
    </article>
  );
}
