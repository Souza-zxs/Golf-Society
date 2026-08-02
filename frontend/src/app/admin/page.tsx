"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";

type Counts = {
  waitlist: number;
  membership: number;
  sponsorship: number;
};

const CARDS = [
  { href: "/admin/waitlist", label: "Lista de Espera", key: "waitlist" as const },
  { href: "/admin/membros", label: "Candidaturas de Membro", key: "membership" as const },
  { href: "/admin/patrocinios", label: "Patrocínios", key: "sponsorship" as const },
];

const OTHER_LINKS = [
  { href: "/admin/reunioes", label: "Reuniões" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/galeria", label: "Galeria" },
];

export default function AdminHomePage() {
  const adminFetch = useAdminFetch();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [waitlist, membership, sponsorship] = await Promise.all([
          adminFetch((key) => adminApi.waitlist.list(key)),
          adminFetch((key) => adminApi.membership.list(key)),
          adminFetch((key) => adminApi.sponsorship.list(key)),
        ]);
        if (cancelled) return;
        setCounts({
          waitlist: waitlist.filter((e) => e.status === "pending").length,
          membership: membership.filter((e) => e.status === "pending").length,
          sponsorship: sponsorship.filter((e) => e.status === "pending").length,
        });
      } catch {
        // erro já tratado (401 redireciona) ou rede fora — painel só fica sem contadores
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">Painel</p>
        <h1 className="font-display mt-2 text-3xl text-ink">Visão geral</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="border border-ink/10 bg-white/40 p-6 transition-colors hover:border-gold"
          >
            <p className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">{card.label}</p>
            <p className="font-display mt-3 text-4xl text-ink">
              {counts ? counts[card.key] : "–"}
            </p>
            <p className="mt-1 text-xs text-stone">pendentes</p>
          </Link>
        ))}
      </div>

      <div>
        <p className="font-data mb-3 text-[11px] uppercase tracking-[0.18em] text-stone">Gestão de conteúdo</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {OTHER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-ink/10 bg-white/40 px-5 py-4 text-sm text-ink transition-colors hover:border-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
