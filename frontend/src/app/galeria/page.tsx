import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { EmptyState } from "@/components/content/empty-state";
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <Reveal key={photo.id} delay={(index % 4) * 80}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image_url}
                    alt={photo.title ?? ""}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 motion-safe:hover:scale-[1.03]"
                  />
                </Reveal>
              ))}
            </div>
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
