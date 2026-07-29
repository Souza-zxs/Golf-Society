import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center bg-ivory py-28">
      <Container className="text-center">
        <Eyebrow tone="light">404</Eyebrow>
        <h1 className="font-display mt-6 text-4xl tracking-tight text-ink sm:text-5xl">
          Esta página não está no roteiro.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-stone">
          O conteúdo que você procura não existe ou foi movido. Volte para a página inicial ou fale com a
          gente.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <LinkButton href="/" variant="outline-light">
            Página Inicial
          </LinkButton>
          <LinkButton href="/contato" variant="solid">
            Falar Conosco
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
