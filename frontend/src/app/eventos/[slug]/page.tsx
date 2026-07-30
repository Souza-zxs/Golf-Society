import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { LinkButton } from "@/components/ui/button";
import { PartnersLedger } from "@/components/content/partners-ledger";
import { PhotoGallery } from "@/components/content/photo-gallery";
import { Reveal } from "@/components/motion/reveal";
import { EVENT_STATUS_LABEL, formatEventDate } from "@/lib/format";
import { api, ApiError, GalleryPhoto, SsgEvent } from "@/lib/api";

async function getEvent(slug: string): Promise<SsgEvent | null> {
  try {
    return await api.events.getBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

async function getEventPhotos(eventId: string): Promise<GalleryPhoto[]> {
  try {
    const { data } = await api.gallery.list({ event_id: eventId, pageSize: 12 });
    return data;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Evento" };
  return { title: event.title, description: event.description ?? undefined };
}

export default async function EventoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const photos = await getEventPhotos(event.id);
  const partners = event.partners ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        {event.cover_image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.cover_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/90 to-ink/50" />
          </>
        ) : null}
        <Container className="relative grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Reveal>
              <Eyebrow>{EVENT_STATUS_LABEL[event.status]}</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display mt-6 text-4xl leading-[1.1] tracking-tight text-ivory sm:text-5xl">
                {event.title}
              </h1>
            </Reveal>
            {event.description ? (
              <Reveal delay={200}>
                <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">{event.description}</p>
              </Reveal>
            ) : null}
            <Reveal delay={300} className="mt-10">
              <LinkButton href="/contato" variant="solid">
                Agendar uma Conversa
              </LinkButton>
            </Reveal>
          </div>

          <LedgerCard tone="dark" delay={150}>
            <LedgerRow label="Data" value={formatEventDate(event.event_date)} />
            {event.start_time ? (
              <LedgerRow
                label="Horário"
                value={event.end_time ? `${event.start_time.slice(0, 5)}–${event.end_time.slice(0, 5)}` : event.start_time.slice(0, 5)}
              />
            ) : null}
            {event.location ? <LedgerRow label="Local" value={event.location} /> : null}
            {event.address ? <LedgerRow label="Endereço" value={event.address} /> : null}
            {event.max_attendees ? <LedgerRow label="Vagas" value={String(event.max_attendees)} /> : null}
          </LedgerCard>
        </Container>
      </section>

      <section className="bg-ivory-2 py-20 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Parceiros" title="Parceiros Confirmados" tone="light" />
          </Reveal>
          <div className="mt-10 max-w-2xl">
            <PartnersLedger partners={partners} tone="light" />
          </div>
        </Container>
      </section>

      {photos.length > 0 ? (
        <section className="bg-ivory py-20 sm:py-24">
          <Container>
            <Reveal>
              <Eyebrow tone="light">Galeria</Eyebrow>
              <h2 className="font-display mt-4 text-3xl tracking-tight text-ink">Registros deste encontro</h2>
            </Reveal>
            <div className="mt-10">
              <PhotoGallery photos={photos} />
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
