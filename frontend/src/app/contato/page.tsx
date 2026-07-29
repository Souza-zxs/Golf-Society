import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { MeetingBooking } from "@/components/forms/meeting-booking";
import { Reveal } from "@/components/motion/reveal";
import { SOCIAL_LINKS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Sellers Society Golf ou agende uma conversa diretamente com o time.",
};

export default function ContatoPage() {
  return (
    <>
      <section className="bg-ink py-20 sm:py-24">
        <Container>
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

      <section className="bg-ink pb-24 sm:pb-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Agende uma Conversa" title="Horários disponíveis com o time" tone="dark" />
          </Reveal>
          <div className="mt-10 max-w-2xl">
            <MeetingBooking />
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-24 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <SectionHeading eyebrow="Lista de Espera" title="Deixe seus dados" tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">
              Conte um pouco sobre você. Nossa equipe entra em contato para os próximos passos — seja para
              associação, patrocínio ou apenas para entender melhor a comunidade.
            </p>
            <p className="font-data mt-8 text-[11px] uppercase tracking-[0.2em] text-stone">
              Prefere o WhatsApp?{" "}
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-gold underline-offset-4">
                Fale conosco
              </a>
            </p>
          </Reveal>
          <Reveal delay={150}>
            <WaitlistForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
