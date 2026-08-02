"use client";

import { useEffect, useState } from "react";
import { adminApi, type ApplicationStatus, type MembershipApplication } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS: ApplicationStatus[] = ["pending", "under_review", "approved", "rejected"];

export default function AdminMembershipPage() {
  const adminFetch = useAdminFetch();
  const [entries, setEntries] = useState<MembershipApplication[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminFetch((key) => adminApi.membership.list(key));
      setEntries(data);
    } catch {
      setError("Não foi possível carregar as candidaturas.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      const updated = await adminFetch((key) => adminApi.membership.updateStatus(key, id, status));
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
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">Seja um Membro</p>
        <h1 className="font-display mt-2 text-3xl text-ink">Candidaturas</h1>
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!entries ? (
        <p className="text-sm text-stone">Carregando…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-stone">Nenhuma candidatura ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="border border-ink/10 bg-white/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-ink">{entry.name}</p>
                    <p className="text-sm text-stone">
                      {entry.role} · {entry.company}
                    </p>
                    <p className="mt-1 text-xs text-stone">
                      {entry.email} · {entry.phone} {entry.city ? `· ${entry.city}` : ""}
                    </p>
                  </div>
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
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                  className="font-data mt-3 text-[11px] uppercase tracking-[0.14em] text-gold hover:underline"
                >
                  {expanded ? "Ocultar motivação" : "Ver motivação"}
                </button>

                {expanded ? (
                  <div className="mt-3 border-t border-ink/10 pt-3 text-sm text-ink/80">
                    <p className="whitespace-pre-line">{entry.motivation}</p>
                    {entry.linkedin_url ? (
                      <a
                        href={entry.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-xs text-gold hover:underline"
                      >
                        {entry.linkedin_url}
                      </a>
                    ) : null}
                  </div>
                ) : null}

                <p className="mt-3 text-xs text-stone">Recebido em {formatDateTime(entry.created_at)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
