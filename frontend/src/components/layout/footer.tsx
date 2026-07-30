import Link from "next/link";
import { Container } from "../ui/container";
import { Logo } from "./logo";
import { Eyebrow } from "../ui/eyebrow";
import { LinkButton } from "../ui/button";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/nav";

const SOCIALS = [
  {
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    path: "M12 2.2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.25 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.21 15.06 2.2 14.72 2.2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.25-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.21 9.28 2.2 12 2.2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.87-.18-1.34-.3-1.65a2.7 2.7 0 0 0-.66-1.02 2.7 2.7 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3-1.05-.05-1.37-.06-4.04-.06Zm0 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 1.8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5-2.05a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Z",
  },
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.83v1.57h.05c.53-1 1.85-2.06 3.8-2.06 4.06 0 4.82 2.67 4.82 6.14V21h-4v-5.3c0-1.26-.02-2.88-1.76-2.88-1.76 0-2.03 1.37-2.03 2.79V21h-4V9.5Z",
  },
  {
    label: "WhatsApp",
    href: SOCIAL_LINKS.whatsapp,
    path: "M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.55 3.7-8.25 8.25-8.25a8.2 8.2 0 0 1 8.24 8.25c0 4.55-3.7 8.24-8.24 8.24Zm4.51-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.66 4.23 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gold-soft/15 bg-ink text-mist">
      <Container className="grid gap-14 py-20 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.85fr_0.85fr_0.85fr] sm:py-24">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo tone="dark" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
            Networking empresarial via golfe. Uma comunidade fechada de empresários, CEOs, executivos e
            investidores construída em torno de relações — não de crachás.
          </p>
          <LinkButton href="/seja-membro" variant="outline-dark" className="mt-7 text-[10px]">
            Solicitar Participação
          </LinkButton>
        </div>

        <div>
          <Eyebrow>Navegação</Eyebrow>
          <ul className="mt-6 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-mist transition-colors duration-300 hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Eyebrow>Participe</Eyebrow>
          <ul className="mt-6 flex flex-col gap-3">
            <li>
              <Link
                href="/seja-membro"
                className="text-sm text-mist transition-colors duration-300 hover:text-ivory"
              >
                Seja um Membro
              </Link>
            </li>
            <li>
              <Link
                href="/seja-patrocinador"
                className="text-sm text-mist transition-colors duration-300 hover:text-ivory"
              >
                Seja um Patrocinador
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="text-sm text-mist transition-colors duration-300 hover:text-ivory"
              >
                Agendar uma Conversa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <Eyebrow>Conecte-se</Eyebrow>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center border border-gold-soft/25 text-mist transition-colors duration-300 hover:border-gold-soft/60 hover:text-gold"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="font-data mt-7 text-xs uppercase tracking-[0.2em] text-stone">São Paulo, Brasil</p>
        </div>
      </Container>

      <div className="border-t border-gold-soft/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
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
