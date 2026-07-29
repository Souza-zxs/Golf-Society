import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/button";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/content/event-card";
import { BlogPostCard } from "@/components/content/blog-post-card";
import { EmptyState } from "@/components/content/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { api, BlogPost, SsgEvent } from "@/lib/api";

const PILLARS = [
  {
    label: "Eventos Exclusivos",
    title: "Golfe como palco de negócio",
    description:
      "Encontros em campos selecionados de São Paulo, com formato pensado para gerar conversa real entre decisores — não crachás e coquetel.",
  },
  {
    label: "Comunidade",
    title: "Pares, não plateia",
    description:
      "Um círculo fechado de empresários, CEOs e executivos que se conhecem pelo nome, indicam negócios e se cobram mutuamente por resultado.",
  },
  {
    label: "Patrocínio",
    title: "Marcas que pertencem ao clube",
    description:
      "Parcerias seletivas com marcas que compartilham o padrão da comunidade — presença construída dentro da experiência, não em banner.",
  },
];

async function getUpcomingEvents(): Promise<SsgEvent[]> {
  try {
    const { data } = await api.events.list({ status: "upcoming" });
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const { data } = await api.blog.listPosts();
    return data.slice(0, 3);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [events, posts] = await Promise.all([getUpcomingEvents(), getLatestPosts()]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-ink via-ink to-green-deep pb-24 pt-20 sm:pt-28">
        <ParallaxLayer
          ratio={0.06}
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 79px, var(--color-gold-soft) 79px, var(--color-gold-soft) 80px)",
            }}
          />
        </ParallaxLayer>
        <Container className="relative grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>São Paulo · Por Convite</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
                O golfe é o campo. <em className="italic text-gold">O negócio</em> é o jogo.
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
                Sellers Society Golf reúne empresários, CEOs, executivos e investidores em uma comunidade
                fechada onde relações de confiança — construídas dezoito buracos por vez — se transformam em
                negócio.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap gap-4">
                <LinkButton href="/seja-membro" variant="solid">
                  Solicitar Participação
                </LinkButton>
                <LinkButton href="/o-conceito" variant="outline-dark">
                  Conhecer o Conceito
                </LinkButton>
              </div>
            </Reveal>
          </div>

          <LedgerCard tone="dark" delay={180}>
            <div className="border-b border-gold-soft/15 px-5 py-4">
              <span className="font-data text-[10px] uppercase tracking-[0.24em] text-gold-soft">
                Cartão de Sócio
              </span>
            </div>
            <LedgerRow label="Fundação" value="2024" />
            <LedgerRow label="Sede" value="São Paulo, SP" />
            <LedgerRow label="Acesso" value="Somente Convite" />
            <LedgerRow label="Perfil" value="CEOs · Executivos · Investidores" />
            <LedgerRow label="Expansão" value="Brasil, em fases" />
          </LedgerCard>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display max-w-4xl text-3xl leading-[1.35] tracking-tight text-ink sm:text-4xl">
              Toda grande parceria começa com uma conversa fora do escritório. Criamos o ambiente —
              <em className="italic text-gold"> exclusivo, deliberado, sem pressa</em> — para que essa conversa
              aconteça entre as pessoas certas.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ink py-24 sm:py-28">
        <Container>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <Reveal key={pillar.label} delay={index * 120} className="pt-6">
                <LineDraw tone="dark" className="mb-6" />
                <Eyebrow>{pillar.label}</Eyebrow>
                <h3 className="font-display mt-4 text-2xl text-ivory">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{pillar.description}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Agenda" title="Próximos Encontros" tone="light" />
            <LinkButton href="/eventos" variant="outline-light" className="shrink-0">
              Ver Todos os Eventos
            </LinkButton>
          </Reveal>

          <div className="mt-12">
            {events.length > 0 ? (
              events.map((event, index) => (
                <Reveal key={event.id} delay={index * 90}>
                  <EventCard event={event} />
                </Reveal>
              ))
            ) : (
              <EmptyState
                title="Agenda em preparação"
                description="Os próximos encontros estão sendo confirmados. Solicite participação para ser avisado em primeira mão."
              />
            )}
          </div>
        </Container>
      </section>

      {posts.length > 0 ? (
        <section className="bg-ivory-2 py-24 sm:py-28">
          <Container>
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Conteúdo" title="Do Fairway aos Negócios" tone="light" />
              <LinkButton href="/blog" variant="outline-light" className="shrink-0">
                Ver Todo o Conteúdo
              </LinkButton>
            </Reveal>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 100}>
                  <BlogPostCard post={post} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="bg-green py-24 sm:py-28">
        <Container className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Reveal className="max-w-xl">
            <Eyebrow>Participe</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.1] tracking-tight text-ivory sm:text-5xl">
              O próximo tacada pode ser o seu próximo negócio.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist">
              Torne-se membro ou leve sua marca à comunidade como patrocinador. Vagas limitadas por rodada de
              convites.
            </p>
          </Reveal>
          <Reveal delay={150} className="flex shrink-0 flex-col gap-4 sm:flex-row">
            <LinkButton href="/seja-membro" variant="solid">
              Seja um Membro
            </LinkButton>
            <LinkButton href="/seja-patrocinador" variant="outline-dark">
              Seja um Patrocinador
            </LinkButton>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
