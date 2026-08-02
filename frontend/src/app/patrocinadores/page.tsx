import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { IndexCard } from "@/components/content/index-card";
import { SectionDivider } from "@/components/ui/section-divider";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

export const metadata: Metadata = {
  title: "Patrocinadores",
  description: "Como marcas premium se conectam à comunidade Sellers Society Golf.",
};

const TIERS = [
  {
    index: "01",
    name: "Patrocinador Master",
    text: "Presença de marca em toda a temporada: encontros mensais, torneio trimestral e conteúdo editorial. Um único patrocinador por segmento.",
  },
  {
    index: "02",
    name: "Patrocinador Torneio",
    text: "Naming e ativação de marca em um torneio trimestral específico, com acesso direto aos participantes no dia.",
  },
  {
    index: "03",
    name: "Patrocinador Apoiador",
    text: "Presença pontual em um encontro mensal: formato de entrada para marcas que querem conhecer a comunidade.",
  },
];

export default function PatrocinadoresPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Patrocinadores</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              Marcas que pertencem ao clube, não que anunciam nele.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Não vendemos banner nem cota de patrocínio genérica. Selecionamos marcas que compartilham o
              padrão da comunidade e desenhamos, junto com cada uma, a forma certa de aparecer dentro do
              ecossistema.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Modalidades" title="Três formas de estar presente" tone="dark" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 120}>
                <IndexCard
                  index={tier.index}
                  title={tier.name}
                  description={tier.text}
                  tone="light"
                  className={CARD_SHADOW}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-green py-20 text-center sm:py-24">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <p className="font-display mx-auto max-w-2xl text-3xl italic leading-snug tracking-tight text-ivory sm:text-4xl">
              Conte-nos sobre sua marca. Desenhamos a ativação juntos.
            </p>
            <div className="mt-8">
              <LinkButton href="/seja-patrocinador" variant="solid">
                Enviar Proposta
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
