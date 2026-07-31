import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LedgerCard } from "@/components/ui/ledger-card";
import { EmptyState } from "@/components/content/empty-state";
import { PhotoGallery } from "@/components/content/photo-gallery";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "Galeria de Fotos",
  description: "Registros dos encontros e torneios da Sellers Society Golf.",
};

async function getPhotos() {
  try {
    const { data } = await api.gallery.list({ pageSize: 48 });
    return data;
  } catch {
    return [];
  }
}

export default async function GaleriaPage() {
  const photos = await getPhotos();

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Galeria</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              Registros do clube.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Momentos dos nossos encontros mensais, torneios e experiências com patrocinadores.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green py-20 sm:py-24">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <LedgerCard tone="light" interactive={false} className={`p-4 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)] sm:p-6`}>
            {photos.length > 0 ? (
              <PhotoGallery photos={photos} />
            ) : (
              <EmptyState
                title="Galeria em construção"
                description="As primeiras fotos serão publicadas após o próximo encontro. Volte em breve."
              />
            )}
          </LedgerCard>
        </Container>
      </section>
    </>
  );
}
