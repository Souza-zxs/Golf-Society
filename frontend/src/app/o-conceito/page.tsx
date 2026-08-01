import type { Metadata } from "next";
import Image from "next/image";
import conceitoFairway from "../../../public/conceito-fairway.jpg";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { IndexCard } from "@/components/content/index-card";
import { SectionDivider } from "@/components/ui/section-divider";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

export const metadata: Metadata = {
  title: "O Conceito",
  description: "Por que o golfe é a plataforma de negócios mais subestimada — e como a Sellers Society Golf a organiza.",
};

const REASONS = [
  {
    index: "01",
    title: "Quatro horas sem interrupção",
    text: "Uma rodada dura o suficiente para uma conversa de verdade acontecer — sem notificação, sem reunião marcada em cima, sem plateia. É tempo que ninguém mais está oferecendo.",
  },
  {
    index: "02",
    title: "O jogo revela o caráter",
    text: "Como alguém lida com um mau tacada, honra as próprias regras e trata quem carrega o taco diz mais sobre um sócio em potencial do que qualquer reunião de diretoria.",
  },
  {
    index: "03",
    title: "Ambiente, não evento",
    text: "Trocamos o salão de hotel pelo campo. O relacionamento nasce do ambiente compartilhado, não do crachá — e por isso dura além do dia do encontro.",
  },
];

const FORMATS = [
  { label: "Encontro Mensal", value: "Rodadas de 4 jogadores, formação curada por perfil e interesse" },
  { label: "Torneio Trimestral", value: "Convidados de fora do círculo, patrocínio de marcas parceiras" },
  { label: "Mesa de Negócios", value: "19ª buraco — conversa estruturada após a rodada, com pauta" },
  { label: "Conteúdo", value: "Bastidores, entrevistas e cases da comunidade no Blog" },
];

export default function ConceitoPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <ParallaxLayer ratio={0.05} className="pointer-events-none absolute -inset-y-12 inset-x-0">
          <Image
            src={conceitoFairway}
            alt="Fairway ondulado com bunkers e montanhas ao fundo, na luz dourada do entardecer"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-[.55] contrast-[1.05] saturate-[1.05]"
          />
        </ParallaxLayer>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(11,31,26,0.6)_68%,rgba(14,18,16,0.93)_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink" />
        <ParallaxLayer ratio={0.05} className="pointer-events-none absolute inset-0 opacity-70">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>

        <Container className="relative">
          <Reveal>
            <Eyebrow>O Conceito</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              O golfe nunca foi sobre o golfe.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Há um século, os maiores negócios do mundo nasceram em campos como este. A Sellers Society Golf
              existe para trazer esse método de volta — com curadoria, estrutura e um propósito declarado: gerar
              negócio de verdade entre pessoas que se respeitam.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-linear-to-b from-ink to-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Por que golfe" title="A vantagem que o escritório não tem" tone="dark" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 120}>
                <IndexCard
                  index={reason.index}
                  title={reason.title}
                  description={reason.text}
                  tone="light"
                  className={CARD_SHADOW}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Como Funciona"
              title="Quatro formatos, um objetivo"
              description="Cada formato tem uma função específica na jornada do membro — do primeiro aperto de mão ao contrato assinado."
              tone="dark"
            />
          </Reveal>
          <LedgerCard tone="light" delay={150} className={CARD_SHADOW}>
            {FORMATS.map((item) => (
              <LedgerRow key={item.label} label={item.label} value={item.value} tone="light" size="lg" />
            ))}
          </LedgerCard>
        </Container>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-green py-24 text-center sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <p className="font-display mx-auto max-w-2xl text-3xl italic leading-snug tracking-tight text-ivory sm:text-4xl">
              &ldquo;Não vendemos acesso a um campo. Vendemos acesso às pessoas certas, no momento certo.&rdquo;
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <LinkButton href="/beneficios" variant="outline-dark">
                Ver Benefícios para Membros
              </LinkButton>
              <LinkButton href="/seja-membro" variant="solid">
                Solicitar Participação
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
