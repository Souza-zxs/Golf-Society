import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { IndexCard } from "@/components/content/index-card";

export const metadata: Metadata = {
  title: "O Conceito",
  description: "Por que o golfe é a plataforma de negócios mais subestimada — e como a Sellers Society Golf a organiza.",
};

const REASONS = [
  {
    index: "01",
    title: "Quatro horas sem interrupção",
    text: "Uma rodada dura o suficiente para uma conversa de verdade acontecer — sem notificação, sem reunião marcada em cima, sem plateia. É tempo que ninguém mais está oferecendo.",
  },
  {
    index: "02",
    title: "O jogo revela o caráter",
    text: "Como alguém lida com um mau tacada, honra as próprias regras e trata quem carrega o taco diz mais sobre um sócio em potencial do que qualquer reunião de diretoria.",
  },
  {
    index: "03",
    title: "Ambiente, não evento",
    text: "Trocamos o salão de hotel pelo campo. O relacionamento nasce do ambiente compartilhado, não do crachá — e por isso dura além do dia do encontro.",
  },
];

const FORMATS = [
  { label: "Encontro Mensal", value: "Rodadas de 4 jogadores, formação curada por perfil e interesse" },
  { label: "Torneio Trimestral", value: "Convidados de fora do círculo, patrocínio de marcas parceiras" },
  { label: "Mesa de Negócios", value: "19ª buraco — conversa estruturada após a rodada, com pauta" },
  { label: "Conteúdo", value: "Bastidores, entrevistas e cases da comunidade no Blog" },
];

export default function ConceitoPage() {
  return (
    <>
      <section className="bg-ink py-20 sm:py-28">
        <Container>
          <Reveal>
            <Eyebrow>O Conceito</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              O golfe nunca foi sobre o golfe.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist">
              Há um século, os maiores negócios do mundo nasceram em campos como este. A Sellers Society Golf
              existe para trazer esse método de volta — com curadoria, estrutura e um propósito declarado: gerar
              negócio de verdade entre pessoas que se respeitam.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Por que golfe" title="A vantagem que o escritório não tem" tone="light" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 120}>
                <IndexCard index={reason.index} title={reason.title} description={reason.text} tone="light" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Como Funciona"
              title="Quatro formatos, um objetivo"
              description="Cada formato tem uma função específica na jornada do membro — do primeiro aperto de mão ao contrato assinado."
              tone="dark"
            />
          </Reveal>
          <Reveal delay={150} className="border border-gold-soft/25">
            {FORMATS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 border-b border-gold-soft/15 px-6 py-5 transition-colors duration-300 last:border-b-0 hover:bg-gold-soft/5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="font-data text-[11px] uppercase tracking-[0.2em] text-gold">
                  {item.label}
                </span>
                <span className="text-sm text-mist sm:text-right">{item.value}</span>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-24 text-center sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display mx-auto max-w-2xl text-3xl italic leading-snug tracking-tight text-ink sm:text-4xl">
              &ldquo;Não vendemos acesso a um campo. Vendemos acesso às pessoas certas, no momento certo.&rdquo;
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <LinkButton href="/beneficios" variant="outline-light">
                Ver Benefícios para Membros
              </LinkButton>
              <LinkButton href="/seja-membro" variant="solid">
                Solicitar Participação
              </LinkButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
