import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EventCard } from "@/components/content/event-card";
import { EmptyState } from "@/components/content/empty-state";
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
      <section className="bg-ink py-20 sm:py-28">
        <Container>
          <Eyebrow>Eventos</Eyebrow>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
            A agenda que move a comunidade.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
            Encontros mensais, torneios trimestrais e experiências com patrocinadores — cada um com vagas
            limitadas e formação de grupo curada.
          </p>
        </Container>
      </section>

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          {events.length > 0 ? (
            <div className="flex flex-col">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Agenda em preparação"
              description="Novos eventos estão sendo confirmados. Solicite participação para receber o convite assim que a agenda abrir."
            />
          )}
        </Container>
      </section>
    </>
  );
}
