import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { SectionDivider } from "@/components/ui/section-divider";

export const metadata: Metadata = {
  title: "Benefícios para Membros",
  description: "O que muda quando você entra para a Sellers Society Golf.",
};

const BENEFITS = [
  {
    label: "Agenda Mensal",
    text: "Presença garantida nos encontros mensais em campos parceiros de padrão internacional na Grande São Paulo.",
  },
  {
    label: "Convites Prioritários",
    text: "Primeira leva de convites para torneios trimestrais, eventos de patrocinadores e experiências fechadas.",
  },
  {
    label: "Diretório de Membros",
    text: "Acesso ao círculo completo de membros por setor e interesse — a base para toda indicação de negócio.",
  },
  {
    label: "Mesa de Negócios",
    text: "Espaço estruturado após cada rodada para apresentar projetos, buscar sócios ou fechar parcerias.",
  },
  {
    label: "Visibilidade Editorial",
    text: "Espaço para cases e entrevistas no Blog da Sellers Society Golf, lido pelo restante da comunidade.",
  },
  {
    label: "Condições em Campos Parceiros",
    text: "Tarifas preferenciais para rodadas avulsas e hospedagem em clubes parceiros da comunidade.",
  },
];

export default function BeneficiosPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-28">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Benefícios para Membros</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              O que muda quando você entra para o clube.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Associar-se à Sellers Society Golf não é comprar um ingresso — é adquirir um lugar permanente em
              uma rede que trabalha para você mesmo quando você não está jogando.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Como Membro" title="Seis vantagens, um único critério de entrada" tone="dark" />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.label} delay={(index % 3) * 110}>
                <LineDraw tone="dark" className="mb-5" />
                <h3 className="font-display text-xl text-ivory">{benefit.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{benefit.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-green py-20 text-center sm:py-24">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <p className="font-display mx-auto max-w-2xl text-3xl italic leading-snug tracking-tight text-ivory sm:text-4xl">
              A candidatura leva cinco minutos. A análise, um convite por vez.
            </p>
            <div className="mt-8">
              <LinkButton href="/seja-membro" variant="solid">
                Iniciar Candidatura
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
