import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BlogPostCard } from "@/components/content/blog-post-card";
import { EmptyState } from "@/components/content/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Conteúdo",
  description: "Bastidores, entrevistas e cases da comunidade Sellers Society Golf.",
};

async function getPosts() {
  try {
    const { data } = await api.blog.listPosts({ pageSize: 30 });
    return data;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <section className="bg-ink py-20 sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow>Conteúdo</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              Do fairway aos negócios.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Bastidores dos encontros, entrevistas com membros e reflexões sobre negócio, liderança e golfe.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 110}>
                  <BlogPostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Primeiras publicações a caminho"
              description="Estamos preparando o primeiro conteúdo da comunidade. Volte em breve."
            />
          )}
        </Container>
      </section>
    </>
  );
}
