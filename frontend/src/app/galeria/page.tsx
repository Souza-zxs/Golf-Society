import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EmptyState } from "@/components/content/empty-state";
import { PhotoGallery } from "@/components/content/photo-gallery";
import { Reveal } from "@/components/motion/reveal";
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
      <section className="bg-ink py-20 sm:py-28">
        <Container>
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

      <section className="bg-ivory py-20 sm:py-24">
        <Container>
          {photos.length > 0 ? (
            <PhotoGallery photos={photos} />
          ) : (
            <EmptyState
              title="Galeria em construção"
              description="As primeiras fotos serão publicadas após o próximo encontro. Volte em breve."
            />
          )}
        </Container>
      </section>
    </>
  );
}
