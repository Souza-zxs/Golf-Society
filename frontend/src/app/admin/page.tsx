"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { PageHeader } from "@/components/admin/page-header";
import {
  BriefcaseIcon,
  CalendarIcon,
  DocumentIcon,
  FlagIcon,
  HourglassIcon,
  ImageIcon,
  UserIcon,
} from "@/components/admin/icons";

type Counts = {
  waitlist: number;
  membership: number;
  sponsorship: number;
};

const CARDS = [
  { href: "/admin/waitlist", label: "Lista de Espera", key: "waitlist" as const, icon: HourglassIcon },
  { href: "/admin/membros", label: "Candidaturas de Membro", key: "membership" as const, icon: UserIcon },
  { href: "/admin/patrocinios", label: "Patrocínios", key: "sponsorship" as const, icon: BriefcaseIcon },
];

const OTHER_LINKS = [
  { href: "/admin/reunioes", label: "Reuniões", icon: CalendarIcon },
  { href: "/admin/blog", label: "Blog", icon: DocumentIcon },
  { href: "/admin/eventos", label: "Eventos", icon: FlagIcon },
  { href: "/admin/galeria", label: "Galeria", icon: ImageIcon },
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
      <PageHeader eyebrow="Painel" title="Visão geral" />

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden border border-ink/10 bg-white p-6 shadow-[0_1px_3px_rgba(14,18,16,0.06)] transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_10px_24px_-12px_rgba(14,18,16,0.18)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">{card.label}</p>
                <Icon className="h-5 w-5 text-gold-soft transition-colors group-hover:text-gold" />
              </div>
              <p className="font-display mt-4 text-4xl text-ink">{counts ? counts[card.key] : "–"}</p>
              <p className="mt-1 text-xs text-stone">pendentes</p>
              <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          );
        })}
      </div>

      <div>
        <p className="font-data mb-3 text-[11px] uppercase tracking-[0.18em] text-stone">Gestão de conteúdo</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {OTHER_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 border border-ink/10 bg-white px-5 py-4 text-sm text-ink shadow-[0_1px_3px_rgba(14,18,16,0.06)] transition-colors hover:border-gold"
              >
                <Icon className="h-4 w-4 text-gold-soft" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
