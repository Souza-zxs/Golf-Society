import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { SponsorshipForm } from "@/components/forms/sponsorship-form";

export const metadata: Metadata = {
  title: "Seja um Patrocinador",
  description: "Leve sua marca à comunidade Sellers Society Golf.",
};

export default function SejaPatrocinadorPage() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow tone="light">Seja um Patrocinador</Eyebrow>
          <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Contamos sua proposta antes de definir o formato.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-stone">
            Cada parceria é desenhada sob medida — para a marca e para a comunidade. Conte sobre seus
            objetivos e nosso time comercial retorna com uma proposta de ativação.
          </p>

          <div className="mt-10">
            <LedgerCard tone="light">
              <LedgerRow label="Modalidades" value="Master · Torneio · Apoiador" tone="light" />
              <LedgerRow label="Retorno" value="Time comercial em até 3 dias" tone="light" />
            </LedgerCard>
          </div>
        </div>

        <div>
          <SponsorshipForm />
        </div>
      </Container>
    </section>
  );
}
