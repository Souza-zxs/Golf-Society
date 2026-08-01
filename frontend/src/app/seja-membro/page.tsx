import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { MembershipApplication } from "@/components/forms/membership-application";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Seja um Membro",
  description: "Candidate-se à Sellers Society Golf — comunidade de negócios por convite.",
};

export default function SejaMembroPage() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow tone="light">Seja um Membro</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
              A candidatura é o primeiro filtro.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-base leading-relaxed text-stone">
              Não existe adesão automática. Toda candidatura passa pelo nosso comitê, que avalia trajetória,
              aderência ao propósito da comunidade e o que cada pessoa pode contribuir — não só o que espera
              receber. Preencha ao lado: seu cartão de sócio se monta em tempo real, conforme você escreve.
            </p>
          </Reveal>

          <div className="mt-10 max-w-sm">
            <LedgerCard tone="light" delay={280}>
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
