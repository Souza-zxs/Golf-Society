"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, api, type SsgEvent } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatEventDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function AdminEventsPage() {
  const adminFetch = useAdminFetch();
  const [events, setEvents] = useState<SsgEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const { data } = await api.events.list({ pageSize: 50 });
      setEvents(data);
    } catch {
      setError("Não foi possível carregar os eventos.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Remover este evento definitivamente?")) return;
    setDeletingId(id);
    try {
      await adminFetch((key) => adminApi.events.remove(key, id));
      setEvents((prev) => prev?.filter((event) => event.id !== id) ?? prev);
    } catch {
      setError("Não foi possível remover o evento.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">Eventos</p>
          <h1 className="font-display mt-2 text-3xl text-ink">Todos os eventos</h1>
        </div>
        <Link href="/admin/eventos/novo">
          <Button variant="solid">Novo evento</Button>
        </Link>
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!events ? (
        <p className="text-sm text-stone">Carregando…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-stone">Nenhum evento ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink/5 font-data text-[11px] uppercase tracking-[0.14em] text-stone">
              <tr>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-ink/10">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{event.title}</p>
                    <p className="text-xs text-stone">/{event.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">{formatEventDate(event.event_date)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/eventos/${event.id}`}
                        className="font-data text-[11px] uppercase tracking-[0.14em] text-gold hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="font-data text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
