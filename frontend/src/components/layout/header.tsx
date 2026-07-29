"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "../ui/container";
import { Logo } from "./logo";
import { NAV_LINKS } from "@/lib/nav";
import { LinkButton } from "../ui/button";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gold-soft/15 bg-ink/95 backdrop-blur transition-shadow duration-500 ${
        scrolled ? "shadow-[0_18px_40px_-28px_rgba(0,0,0,0.7)]" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        <Logo tone="dark" />

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-data relative shrink-0 whitespace-nowrap py-1 text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${
                  active ? "text-gold after:scale-x-100" : "text-mist after:scale-x-0 hover:text-ivory"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 xl:block">
          <LinkButton href="/seja-membro" variant="outline-dark" className="whitespace-nowrap text-[10px]">
            Solicitar Participação
          </LinkButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="flex h-10 w-10 items-center justify-center border border-gold-soft/30 text-ivory xl:hidden"
        >
          <span className="font-data text-xs">{open ? "FECHAR" : "MENU"}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-gold-soft/15 bg-ink xl:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 * index, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="font-data border-b border-gold-soft/10 py-3 text-xs uppercase tracking-[0.18em] text-mist last:border-b-0 hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.04 * NAV_LINKS.length, ease: [0.16, 1, 0.3, 1] }}
                className="pt-5"
              >
                <LinkButton href="/seja-membro" variant="solid" className="w-full">
                  Solicitar Participação
                </LinkButton>
              </motion.div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
