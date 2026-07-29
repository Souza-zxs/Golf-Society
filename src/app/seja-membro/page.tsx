import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { MembershipForm } from "@/components/forms/membership-form";

export const metadata: Metadata = {
  title: "Seja um Membro",
  description: "Candidate-se à Sellers Society Golf — comunidade de negócios por convite.",
};

export default function SejaMembroPage() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow tone="light">Seja um Membro</Eyebrow>
          <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
            A candidatura é o primeiro filtro.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone">
            Não existe adesão automática. Toda candidatura passa pelo nosso comitê, que avalia trajetória,
            aderência ao propósito da comunidade e o que cada pessoa pode contribuir — não só o que espera
            receber.
          </p>

          <div className="mt-10">
            <LedgerCard tone="light">
              <LedgerRow label="Resposta" value="Até 5 dias úteis" tone="light" />
              <LedgerRow label="Critério" value="Trajetória + aderência" tone="light" />
              <LedgerRow label="Vagas" value="Limitadas por rodada" tone="light" />
            </LedgerCard>
          </div>
        </div>

        <div>
          <MembershipForm />
        </div>
      </Container>
    </section>
  );
}
