"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAdminAuth } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/waitlist", label: "Lista de Espera" },
  { href: "/admin/membros", label: "Candidaturas de Membro" },
  { href: "/admin/patrocinios", label: "Patrocínios" },
  { href: "/admin/reunioes", label: "Reuniões" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/galeria", label: "Galeria" },
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
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-ink/10 bg-ink sticky top-0">
        <div className="p-6">
          <p className="font-display text-lg text-ivory">Sellers Society Golf</p>
          <p className="font-data mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-soft">Painel Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  active ? "bg-ivory/10 text-gold-soft" : "text-ivory/80 hover:bg-ivory/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="font-data w-full rounded border border-ivory/20 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:border-gold-soft hover:text-gold-soft"
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8 sm:p-10">{children}</main>
    </div>
  );
}
