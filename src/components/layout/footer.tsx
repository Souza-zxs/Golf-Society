import Link from "next/link";
import { Container } from "../ui/container";
import { Logo } from "./logo";
import { Eyebrow } from "../ui/eyebrow";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";

export function Footer() {
  return (
    <footer className="border-t border-gold-soft/15 bg-ink text-mist">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo tone="dark" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
            Networking empresarial via golfe. Uma comunidade fechada de empresários, CEOs, executivos e
            investidores construída em torno de relações — não de crachás.
          </p>
        </div>

        <div>
          <Eyebrow>Navegação</Eyebrow>
          <ul className="mt-5 flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-mist transition-colors hover:text-ivory">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow>Participe</Eyebrow>
          <ul className="mt-5 flex flex-col gap-2.5">
            <li>
              <Link href="/seja-membro" className="text-sm text-mist transition-colors hover:text-ivory">
                Seja um Membro
              </Link>
            </li>
            <li>
              <Link href="/seja-patrocinador" className="text-sm text-mist transition-colors hover:text-ivory">
                Seja um Patrocinador
              </Link>
            </li>
            <li>
              <Link href="/contato" className="text-sm text-mist transition-colors hover:text-ivory">
                Agendar uma Conversa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <Eyebrow>Conecte-se</Eyebrow>
          <ul className="mt-5 flex flex-col gap-2.5">
            <li>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mist transition-colors hover:text-ivory"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mist transition-colors hover:text-ivory"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-mist transition-colors hover:text-ivory"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <p className="font-data mt-6 text-xs uppercase tracking-[0.2em] text-stone">São Paulo, Brasil</p>
        </div>
      </Container>

      <div className="border-t border-gold-soft/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="font-data text-[10px] uppercase tracking-[0.2em] text-stone">
            © {new Date().getFullYear()} Sellers Society Golf — por convite
          </p>
          <p className="font-data text-[10px] uppercase tracking-[0.2em] text-stone">
            Acesso restrito a membros e convidados
          </p>
        </Container>
      </div>
    </footer>
  );
}
