import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LedgerCard, LedgerRow } from "@/components/ui/ledger-card";
import { Reveal } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Quem está por trás da Sellers Society Golf e o padrão que guia cada convite.",
};

const VALUES = [
  {
    label: "Curadoria",
    text: "Cada membro é avaliado individualmente. Não existe adesão automática — existe convite.",
  },
  {
    label: "Discrição",
    text: "O que se discute no campo fica entre os jogadores. Confiança é o ativo mais valioso do clube.",
  },
  {
    label: "Reciprocidade",
    text: "Espera-se que todo membro esteja tão disposto a abrir portas quanto a cruzá-las.",
  },
  {
    label: "Excelência",
    text: "Do campo escolhido ao roteiro do encontro, nada é padrão — tudo é decidido a dedo.",
  },
];

export default function SobrePage() {
  return (
    <>
      <section className="bg-ink py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>Sobre</Eyebrow>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display mt-6 text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
                Uma sociedade, não uma agenda de eventos.
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
                A Sellers Society Golf nasceu de uma constatação simples: os melhores negócios de São Paulo
                continuam nascendo em conversas informais entre pessoas que se conhecem e confiam umas nas
                outras. Formalizamos esse encontro — sem tirar o que o torna valioso.
              </p>
            </Reveal>
          </div>
          <LedgerCard tone="dark" delay={150}>
            <LedgerRow label="Segmento" value="Networking Empresarial" />
            <LedgerRow label="Plataforma" value="Golfe" />
            <LedgerRow label="Praça Inicial" value="São Paulo" />
            <LedgerRow label="Modelo" value="Membros + Patrocinadores" />
          </LedgerCard>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Missão" title="Transformar tempo de lazer em capital de relacionamento" tone="light" />
            <p className="mt-6 text-base leading-relaxed text-stone">
              Acreditamos que negócios sérios se constroem em ambientes descontraídos, entre pessoas que se
              respeitam. Nosso papel é montar esse ambiente com o rigor de uma operação de negócios: seleção
              criteriosa de membros, campos de padrão internacional e uma agenda desenhada para gerar conexão
              real — não apenas cartões de visita trocados.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading eyebrow="Visão" title="A referência de networking empresarial no Brasil" tone="light" />
            <p className="mt-6 text-base leading-relaxed text-stone">
              Começamos em São Paulo porque é aqui que a maior concentração de decisores do país joga golfe.
              A expansão para outras praças brasileiras segue o mesmo princípio de todo o clube: crescer sem
              diluir o padrão.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-green py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Valores" title="O padrão por trás de cada convite" tone="dark" />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <Reveal key={value.label} delay={index * 100}>
                <LineDraw tone="dark" className="mb-5" />
                <span className="font-data text-[11px] uppercase tracking-[0.2em] text-gold">
                  {value.label}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-mist">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
