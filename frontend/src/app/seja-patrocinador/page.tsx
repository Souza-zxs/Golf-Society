import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { SponsorshipForm } from "@/components/forms/sponsorship-form";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

export const metadata: Metadata = {
  title: "Seja um Patrocinador",
  description: "Leve sua marca à comunidade Sellers Society Golf.",
};

export default function SejaPatrocinadorPage() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
      <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
        <ContourField className="h-full w-full" />
      </ParallaxLayer>
      <Container className="relative grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Reveal>
            <Eyebrow>Seja um Patrocinador</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ivory sm:text-5xl">
              Conte sua marca. Desenhamos o formato juntos.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-mist">
              Cada parceria é desenhada sob medida, para a marca e para a comunidade. Conte sobre seus
              objetivos e nosso time comercial retorna com uma proposta de ativação.
            </p>
          </Reveal>

          <div className="mt-10">
            <LedgerCard tone="light" delay={280} className={CARD_SHADOW}>
              <LedgerRow label="Modalidades" value="Master · Torneio · Apoiador" tone="light" />
              <LedgerRow label="Retorno" value="Time comercial em até 3 dias" tone="light" />
            </LedgerCard>
          </div>
        </div>

        <LedgerCard tone="light" delay={150} interactive={false} className={`p-6 sm:p-8 ${CARD_SHADOW}`}>
          <SponsorshipForm />
        </LedgerCard>
      </Container>
    </section>
  );
}
