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
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { SectionDivider } from "@/components/ui/section-divider";
import { EVENT_STATUS_LABEL, formatEventDate } from "@/lib/format";
import { api, ApiError, GalleryPhoto, SsgEvent } from "@/lib/api";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

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
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
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
        ) : (
          <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
            <ContourField className="h-full w-full" />
          </ParallaxLayer>
        )}
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

          <LedgerCard tone="light" delay={150} className={CARD_SHADOW}>
            <LedgerRow label="Data" value={formatEventDate(event.event_date)} tone="light" />
            {event.start_time ? (
              <LedgerRow
                label="Horário"
                value={event.end_time ? `${event.start_time.slice(0, 5)}–${event.end_time.slice(0, 5)}` : event.start_time.slice(0, 5)}
                tone="light"
              />
            ) : null}
            {event.location ? <LedgerRow label="Local" value={event.location} tone="light" /> : null}
            {event.address ? <LedgerRow label="Endereço" value={event.address} tone="light" /> : null}
            {event.max_attendees ? <LedgerRow label="Vagas" value={String(event.max_attendees)} tone="light" /> : null}
          </LedgerCard>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green py-20 sm:py-24">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Parceiros" title="Parceiros Confirmados" tone="dark" />
          </Reveal>
          <div className="mt-10 max-w-2xl">
            <LedgerCard tone="light" interactive={false} className={CARD_SHADOW}>
              <div className="p-1">
                <PartnersLedger partners={partners} tone="light" />
              </div>
            </LedgerCard>
          </div>
        </Container>
      </section>

      {photos.length > 0 ? <SectionDivider /> : null}

      {photos.length > 0 ? (
        <section className="relative overflow-hidden bg-green py-20 sm:py-24">
          <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
            <ContourField className="h-full w-full" />
          </ParallaxLayer>
          <Container className="relative">
            <Reveal>
              <Eyebrow>Galeria</Eyebrow>
              <h2 className="font-display mt-4 text-3xl tracking-tight text-ivory">Registros deste encontro</h2>
            </Reveal>
            <div className="mt-10">
              <LedgerCard tone="light" interactive={false} className={`p-4 sm:p-6 ${CARD_SHADOW}`}>
                <PhotoGallery photos={photos} />
              </LedgerCard>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
