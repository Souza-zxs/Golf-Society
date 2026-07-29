"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Container } from "../ui/container";
import { Logo } from "./logo";
import { NAV_LINKS } from "@/lib/nav";
import { LinkButton } from "../ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gold-soft/15 bg-ink/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Logo tone="dark" />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-data relative py-1 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${
                  active ? "text-gold after:scale-x-100" : "text-mist after:scale-x-0 hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/seja-membro" variant="outline-dark" className="text-[10px]">
            Solicitar Participação
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="flex h-10 w-10 items-center justify-center border border-gold-soft/30 text-ivory lg:hidden"
        >
          <span className="font-data text-xs">{open ? "FECHAR" : "MENU"}</span>
        </button>
      </Container>

      {open ? (
        <div id="mobile-nav" className="border-t border-gold-soft/15 bg-ink lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-data border-b border-gold-soft/10 py-3 text-xs uppercase tracking-[0.18em] text-mist last:border-b-0 hover:text-ivory"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-5">
              <LinkButton href="/seja-membro" variant="solid" className="w-full">
                Solicitar Participação
              </LinkButton>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
