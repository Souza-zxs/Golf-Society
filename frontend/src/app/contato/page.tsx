import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { LedgerCard } from "@/components/ui/ledger-card";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { MeetingBooking } from "@/components/forms/meeting-booking";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { ContourField } from "@/components/motion/contour-field";
import { SectionDivider } from "@/components/ui/section-divider";
import { SOCIAL_LINKS } from "@/lib/nav";

const CARD_SHADOW = "shadow-[0_30px_60px_-28px_rgba(0,0,0,0.5)]";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Sellers Society Golf ou agende uma conversa diretamente com o time.",
};

export default function ContatoPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-b from-green-deep to-green py-20 sm:py-24">
        <ParallaxLayer ratio={0.06} className="pointer-events-none absolute inset-0">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <Eyebrow>Contato</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-6 max-w-2xl text-5xl leading-[1.1] tracking-tight text-ivory sm:text-6xl">
              Fale com a Sellers Society Golf.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
              Prefere uma conversa direta? Escolha um horário abaixo. Prefere deixar seus dados e ser
              contatado? Use o formulário mais abaixo.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-green pb-24 sm:pb-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative">
          <Reveal>
            <SectionHeading eyebrow="Agende uma Conversa" title="Horários disponíveis com o time" tone="dark" />
          </Reveal>
          <LedgerCard
            tone="light"
            delay={100}
            interactive={false}
            className={`mt-10 max-w-2xl p-6 sm:p-8 ${CARD_SHADOW}`}
          >
            <MeetingBooking />
          </LedgerCard>
        </Container>
      </section>

      <SectionDivider />

      <section className="relative overflow-hidden bg-green py-24 sm:py-28">
        <ParallaxLayer ratio={0.04} className="pointer-events-none absolute inset-0 opacity-40">
          <ContourField className="h-full w-full" />
        </ParallaxLayer>
        <Container className="relative grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading eyebrow="Lista de Espera" title="Deixe seus dados" tone="dark" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-mist">
              Conte um pouco sobre você. Nossa equipe entra em contato para os próximos passos — seja para
              associação, patrocínio ou apenas para entender melhor a comunidade.
            </p>
            <p className="font-data mt-8 text-[11px] uppercase tracking-[0.2em] text-mist">
              Prefere o WhatsApp?{" "}
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gold underline decoration-gold underline-offset-4">
                Fale conosco
              </a>
            </p>
          </Reveal>
          <LedgerCard tone="light" delay={150} className={`p-6 sm:p-8 ${CARD_SHADOW}`} interactive={false}>
            <WaitlistForm />
          </LedgerCard>
        </Container>
      </section>
    </>
  );
}
