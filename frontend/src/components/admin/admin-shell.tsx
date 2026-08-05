"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  BriefcaseIcon,
  CalendarIcon,
  CompassIcon,
  DocumentIcon,
  FlagIcon,
  HourglassIcon,
  ImageIcon,
  LogoutIcon,
  UserIcon,
} from "./icons";

const NAV = [
  { href: "/admin", label: "Painel", icon: CompassIcon },
  { href: "/admin/waitlist", label: "Lista de Espera", icon: HourglassIcon },
  { href: "/admin/membros", label: "Candidaturas de Membro", icon: UserIcon },
  { href: "/admin/patrocinios", label: "Patrocínios", icon: BriefcaseIcon },
  { href: "/admin/reunioes", label: "Reuniões", icon: CalendarIcon },
  { href: "/admin/blog", label: "Blog", icon: DocumentIcon },
  { href: "/admin/eventos", label: "Eventos", icon: FlagIcon },
  { href: "/admin/galeria", label: "Galeria", icon: ImageIcon },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { key, hydrated, clear } = useAdminAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!hydrated) return;
    if (!key && !isLoginPage) router.replace("/admin/login");
    if (key && isLoginPage) router.replace("/admin");
  }, [hydrated, key, isLoginPage, router]);

  // Evita flash de conteúdo protegido antes de ler o localStorage, e evita
  // renderizar a tela errada enquanto o redirect acima ainda não disparou.
  if (!hydrated) return null;
  if (isLoginPage) return <div className="min-h-screen bg-ivory">{children}</div>;
  if (!key) return null;

  function handleLogout() {
    clear();
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-ivory text-ink">
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line-dark bg-ink sticky top-0">
        <div className="border-b border-line-dark p-6">
          <p className="font-display text-lg text-ivory">Sellers Society Golf</p>
          <p className="font-data mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-soft">Painel Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-gold-soft bg-ivory/6 text-gold-soft"
                    : "border-transparent text-ivory/75 hover:border-ivory/20 hover:bg-ivory/3 hover:text-ivory"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line-dark p-3">
          <button
            onClick={handleLogout}
            className="font-data flex w-full items-center justify-center gap-2 border border-ivory/20 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:border-gold-soft hover:text-gold-soft"
          >
            <LogoutIcon className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8 sm:p-10">{children}</main>
    </div>
  );
}
