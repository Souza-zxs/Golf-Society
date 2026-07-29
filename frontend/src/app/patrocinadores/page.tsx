import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Patrocinadores",
  description: "Como marcas premium se conectam à comunidade Sellers Society Golf.",
};

const TIERS = [
  {
    name: "Patrocinador Master",
    text: "Presença de marca em toda a temporada — encontros mensais, torneio trimestral e conteúdo editorial. Um único patrocinador por segmento.",
  },
  {
    name: "Patrocinador Torneio",
    text: "Naming e ativação de marca em um torneio trimestral específico, com acesso direto aos participantes no dia.",
  },
  {
    name: "Patrocinador Apoiador",
    text: "Presença pontual em um encontro mensal — formato de entrada para marcas que querem conhecer a comunidade.",
  },
];

export default function PatrocinadoresPage() {
  return (
    <>
      <section className="bg-ink py-20 sm:py-28">
        <Container>
          <Eyebrow>Patrocinadores</Eyebrow>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
            Marcas que pertencem ao clube, não que anunciam nele.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
            Não vendemos banner nem cota de patrocínio genérica. Selecionamos marcas que compartilham o
            padrão da comunidade e desenhamos, junto com cada uma, a forma certa de aparecer dentro da
            experiência.
          </p>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Modalidades" title="Três formas de estar presente" tone="light" />
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            {TIERS.map((tier) => (
              <div key={tier.name} className="border-t border-ink/15 pt-6">
                <h3 className="font-display text-2xl text-ink">{tier.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone">{tier.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-green py-20 text-center sm:py-24">
        <Container>
          <p className="font-display mx-auto max-w-2xl text-3xl italic leading-snug tracking-tight text-ivory sm:text-4xl">
            Conte-nos sobre sua marca. Desenhamos a ativação juntos.
          </p>
          <div className="mt-8">
            <LinkButton href="/seja-patrocinador" variant="solid">
              Enviar Proposta
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
