import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard } from "@/components/ui/ledger-card";
import { EventCard } from "@/components/content/event-card";
import { EmptyState } from "@/components/content/empty-state";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Agenda de encontros, torneios e experiências da Sellers Society Golf.",
};

async function getEvents() {
  try {
    const { data } = await api.events.list({ pageSize: 50 });
    return data;
  } catch {
    return [];
  }
}

export default async function EventosPage() {
  const events = await getEvents();

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Eventos</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              A agenda que move a comunidade.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Encontros mensais, torneios trimestrais e experiências com patrocinadores — cada um com vagas
              limitadas e formação de grupo curada.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green py-20 sm:py-24">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <LedgerCard tone="light" className="shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-2 sm:px-8">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <Reveal key={event.id} delay={(index % 5) * 80}>
                    <EventCard event={event} />
                  </Reveal>
                ))
              ) : (
                <EmptyState
                  title="Agenda em preparação"
                  description="Novos eventos estão sendo confirmados. Solicite participação para receber o convite assim que a agenda abrir."
                />
              )}
            </div>
          </LedgerCard>
        </Container>
      </section>
    </>
  );
}
