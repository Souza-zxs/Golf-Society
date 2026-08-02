import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { MembershipApplication } from "@/components/forms/membership-application";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

export const metadata: Metadata = {
  title: "Seja um Membro",
  description: "Candidate-se à Sellers Society Golf, comunidade de marcas por convite.",
};

export default function SejaMembroPage() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
      <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
        <ContourField className="h-full w-full" />
      </ParallaxLayer>
      <Container className="relative">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Seja um Membro</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ivory sm:text-5xl">
              A candidatura é o primeiro filtro.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-mist">
              Não existe adesão automática. Toda candidatura passa pelo nosso comitê, que avalia a trajetória
              da sua marca, aderência ao propósito da comunidade e o que você pode contribuir, não só o que
              espera receber. Preencha ao lado: seu cartão de sócio se monta em tempo real, conforme você
              escreve.
            </p>
          </Reveal>

          <div className="mt-10 max-w-sm">
            <LedgerCard tone="light" delay={280} className={CARD_SHADOW}>
              <LedgerRow label="Resposta" value="Até 5 dias úteis" tone="light" />
              <LedgerRow label="Critério" value="Trajetória + aderência" tone="light" />
              <LedgerRow label="Vagas" value="Limitadas por rodada" tone="light" />
            </LedgerCard>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <Reveal delay={150}>
            <MembershipApplication />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
