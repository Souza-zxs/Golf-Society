"use client";

import { useEffect, useState } from "react";
import { adminApi, type ApplicationStatus, type WaitlistEntry } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge, STATUS_LABELS } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS: ApplicationStatus[] = ["pending", "under_review", "approved", "rejected"];

export default function AdminWaitlistPage() {
  const adminFetch = useAdminFetch();
  const [entries, setEntries] = useState<WaitlistEntry[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminFetch((key) => adminApi.waitlist.list(key));
      setEntries(data);
    } catch {
      setError("Não foi possível carregar a lista de espera.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      const updated = await adminFetch((key) => adminApi.waitlist.updateStatus(key, id, status));
      setEntries((prev) => prev?.map((entry) => (entry.id === id ? updated : entry)) ?? prev);
    } catch {
      setError("Não foi possível atualizar o status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">Lista de Espera</p>
        <h1 className="font-display mt-2 text-3xl text-ink">Interessados</h1>
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!entries ? (
        <p className="text-sm text-stone">Carregando…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-stone">Nenhum registro ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-ink/5 font-data text-[11px] uppercase tracking-[0.14em] text-stone">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Empresa / Cargo</th>
                <th className="px-4 py-3">Recebido em</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-ink/10 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{entry.name}</p>
                    {entry.message ? <p className="mt-1 max-w-xs text-xs text-stone">{entry.message}</p> : null}
                  </td>
                  <td className="px-4 py-3 text-stone">
                    <p>{entry.email}</p>
                    <p>{entry.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-stone">
                    <p>{entry.company ?? "—"}</p>
                    <p>{entry.role ?? ""}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-stone">{formatDateTime(entry.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={entry.status} />
                      <select
                        value={entry.status}
                        disabled={updatingId === entry.id}
                        onChange={(event) => handleStatusChange(entry.id, event.target.value as ApplicationStatus)}
                        className="border border-ink/20 bg-transparent px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status] ?? status}
                          </option>
                        ))}
                      </select>
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
