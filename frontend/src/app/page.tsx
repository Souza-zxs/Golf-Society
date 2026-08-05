import Image from "next/image";
import manifestoFairway from "../../public/manifesto-fairway.jpg";
import horizonLogo from "../../public/brand/horizon-logo-cropped.png";
import revollutionLogo from "../../public/brand/revollution-mark-transparent.png";
import hrtLogo from "../../public/brand/hrt-logo-light.png";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/button";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/components/content/event-card";
import { BlogPostCard } from "@/components/content/blog-post-card";
import { EmptyState } from "@/components/content/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { PillarTabs } from "@/components/content/pillar-tabs";
import { SectionDivider } from "@/components/ui/section-divider";
import { api, BlogPost, SsgEvent } from "@/lib/api";

const PILLARS = [
  {
    label: "Eventos Exclusivos",
    index: "01",
    title: "Golfe como palco da marca",
    description:
      "Encontros em campos selecionados de São Paulo, em um ambiente sofisticado inspirado na cultura do golfe corporativo, pensado para gerar conversa real entre decisores, não crachás e coquetel.",
    points: [
      "Rodadas em campos parceiros, grupos pequenos e formato fixo",
      "Agenda por convite, sem inscrição aberta ao público",
      "Vagas limitadas a cada edição para manter a qualidade da conversa",
    ],
  },
  {
    label: "Comunidade",
    index: "02",
    title: "Pares, não plateia",
    description:
      "Um círculo fechado de donos de marca, fundadores e executivos que se conhecem pelo nome, indicam parcerias e se cobram mutuamente pelo crescimento de cada marca.",
    points: [
      "Admissão avaliada por comitê, não por pagamento de mensalidade",
      "Rede ativa entre rodadas, com indicações e apresentações diretas",
      "Perfil concentrado em donos de marca: fundadores, CEOs e investidores",
    ],
  },
  {
    label: "Patrocínio",
    index: "03",
    title: "Marcas que pertencem ao clube",
    description:
      "Parcerias seletivas com marcas que compartilham o padrão da comunidade: presença construída dentro do ecossistema, não em banner.",
    points: [
      "Número reduzido de patrocinadores por edição, sem pulverização",
      "Presença integrada à experiência do encontro, não só logo estampado",
      "Acesso direto ao público de decisores presente em cada rodada",
    ],
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
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green pb-24 pt-20 sm:pt-28">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>São Paulo · Por Convite</Eyebrow>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display mt-6 text-5xl leading-[1.05] tracking-tight text-ivory sm:text-6xl lg:text-7xl">
                Onde líderes desenvolvem habilidades. Onde marcas constroem{" "}
                <em className="italic text-gold">legado</em>.
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
                O golfe é mais do que um esporte. É um ambiente onde estratégia, disciplina, inteligência
                emocional e relacionamentos de alto nível impulsionam líderes, fortalecem marcas e geram
                grandes negócios.
              </p>
            </Reveal>
            <Reveal delay={340}>
              <p className="font-data mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.24em] text-gold-soft/70">
                <span>Exclusividade</span>
                <span aria-hidden>·</span>
                <span>Estratégia</span>
                <span aria-hidden>·</span>
                <span>Conexão</span>
                <span aria-hidden>·</span>
                <span>Legado</span>
              </p>
            </Reveal>
            <Reveal delay={420}>
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

          <LedgerCard tone="dark" delay={180} className="lg:max-w-lg lg:justify-self-end">
            <div className="flex items-center justify-between border-b border-gold-soft/15 px-7 py-5">
              <span className="font-data text-[11px] uppercase tracking-[0.24em] text-gold-soft">
                Cartão de Sócio
              </span>
              <span className="font-display text-lg italic text-gold-soft/40">SSG</span>
            </div>
            <LedgerRow size="lg" label="Fundação" value="2024" />
            <LedgerRow size="lg" label="Sede" value="São Paulo, SP" />
            <LedgerRow size="lg" label="Acesso" value="Somente Convite" />
            <LedgerRow size="lg" label="Perfil" value="Donos de Marca · Fundadores · CEOs" />
            <LedgerRow size="lg" label="Expansão" value="Brasil, em fases" />
          </LedgerCard>
        </Container>
      </section>

      <section className="relative flex min-h-screen items-center overflow-hidden bg-ink py-24">
        <ParallaxLayer ratio={0.05} className="pointer-events-none absolute -inset-y-12 inset-x-0">
          <Image
            src={manifestoFairway}
            alt="Fairway ao entardecer, com a bandeira da Sellers Society Golf junto ao lago"
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-[center_35%] brightness-[.62] contrast-[1.08] saturate-[1.05]"
          />
        </ParallaxLayer>

        {/* Vinheta: escurece as bordas e casa as emendas com o verde/ink das seções vizinhas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(11,31,26,0.6)_68%,rgba(14,18,16,0.93)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-green via-transparent to-ink"
        />

        <ParallaxLayer ratio={0.05} className="pointer-events-none absolute inset-0 opacity-70">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>

        <span
          aria-hidden
          className="font-display pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 select-none text-[26rem] italic leading-none text-gold-soft/[0.06] sm:text-[34rem]"
        >
          &ldquo;
        </span>

        <Container className="relative">
          <Reveal className="flex justify-center">
            <Eyebrow>Manifesto</Eyebrow>
          </Reveal>

          <div className="mx-auto mt-10 max-w-2xl text-center">
            <Reveal delay={100}>
              <p className="font-display text-xl leading-normal tracking-tight text-mist sm:text-2xl">
                Toda grande marca precisa de um lugar para crescer.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="font-display mt-8 text-3xl leading-[1.35] tracking-tight text-ivory sm:text-4xl lg:text-5xl">
                O patrimônio de uma marca, <em className="italic text-gold">começa pelo lugar onde ela cresce</em>.
              </p>
            </Reveal>
          </div>

          <Reveal delay={420} className="mt-14 flex flex-col items-center gap-5">
            <span className="h-px w-12 bg-gold-soft/30" aria-hidden />
            <span className="font-data text-[11px] uppercase tracking-[0.3em] text-mist">
              Sellers Society Golf
            </span>
          </Reveal>

          <Reveal delay={520} className="mt-16 flex flex-col items-center gap-6">
            <span className="font-data text-[10px] uppercase tracking-[0.3em] text-mist/50">Um Projeto</span>
            <div className="flex flex-wrap items-center justify-center gap-16 sm:gap-24">
              <a
                href="https://horizonlabs.com.br"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Horizon"
              >
                <Image
                  src={horizonLogo}
                  alt="Horizon"
                  className="h-28 w-auto opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-36"
                />
              </a>
              <a
                href="https://www.hrtcosmeticos.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="HRT Cosméticos"
              >
                <Image
                  src={hrtLogo}
                  alt="HRT Cosméticos"
                  className="h-20 w-auto opacity-70 transition-opacity duration-300 hover:opacity-100 sm:h-24"
                />
              </a>
              <a
                href="https://revolutionpatentes.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Revollution Ideas"
              >
                <Image
                  src={revollutionLogo}
                  alt="Revollution Ideas"
                  className="h-28 w-auto opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-36"
                />
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-linear-to-b from-ink to-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Como Funciona</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <PillarTabs pillars={PILLARS} />
          </Reveal>
        </Container>
      </section>

      <SectionDivider />

      <section className="bg-green py-24 sm:py-28">
        <Container>
          <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Agenda" title="Próximos Encontros" tone="dark" />
            <LinkButton href="/eventos" variant="outline-dark" className="shrink-0">
              Ver Todos os Eventos
            </LinkButton>
          </Reveal>

          <LedgerCard tone="light" delay={100} className="mt-12 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 sm:px-8">
              <span className="font-data text-[10px] uppercase tracking-[0.24em] text-stone">
                Calendário · Sellers Society Golf
              </span>
              <span className="font-data text-[10px] uppercase tracking-[0.2em] text-gold">
                {events.length > 0 ? `${events.length} confirmados` : "Em aberto"}
              </span>
            </div>
            <div className="px-6 py-2 sm:px-8">
              {events.length > 0 ? (
                events.map((event) => <EventCard key={event.id} event={event} />)
              ) : (
                <EmptyState
                  title="Agenda em preparação"
                  description="Os próximos encontros estão sendo confirmados. Solicite participação para ser avisado em primeira mão."
                />
              )}
            </div>
          </LedgerCard>
        </Container>
      </section>

      <SectionDivider />

      {posts.length > 0 ? (
        <section className="bg-[linear-gradient(to_bottom,var(--color-green)_0%,var(--color-ivory)_12%,var(--color-ivory)_88%,var(--color-green)_100%)] py-24 sm:py-28">
          <Container>
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading eyebrow="Conteúdo" title="Do Fairway à Sua Marca" tone="light" />
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

      {posts.length > 0 ? <SectionDivider /> : null}

      <section className="relative overflow-hidden bg-linear-to-b from-green to-ink py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Reveal className="max-w-xl">
            <Eyebrow>Participe</Eyebrow>
            <h2 className="font-display mt-5 text-4xl leading-[1.1] tracking-tight text-ivory sm:text-5xl">
              A próxima tacada pode ser o próximo capítulo da sua marca.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-mist">
              Torne-se membro ou leve sua marca à comunidade como patrocinadora. Vagas limitadas por rodada de
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
