"use client";

import { useEffect, useState } from "react";
import { adminApi, type ApplicationStatus, type SponsorshipApplication } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge, STATUS_LABELS } from "@/components/admin/status-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { PageHeader } from "@/components/admin/page-header";
import { LoadingState, EmptyState } from "@/components/admin/list-state";
import { formatDateTime } from "@/lib/format";

const STATUS_OPTIONS: ApplicationStatus[] = ["pending", "under_review", "approved", "rejected"];

export default function AdminSponsorshipPage() {
  const adminFetch = useAdminFetch();
  const [entries, setEntries] = useState<SponsorshipApplication[] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminFetch((key) => adminApi.sponsorship.list(key));
      setEntries(data);
    } catch {
      setError("Não foi possível carregar as candidaturas de patrocínio.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setUpdatingId(id);
    try {
      const updated = await adminFetch((key) => adminApi.sponsorship.updateStatus(key, id, status));
      setEntries((prev) => prev?.map((entry) => (entry.id === id ? updated : entry)) ?? prev);
    } catch {
      setError("Não foi possível atualizar o status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remover esta candidatura de patrocínio definitivamente?")) return;
    setDeletingId(id);
    try {
      await adminFetch((key) => adminApi.sponsorship.remove(key, id));
      setEntries((prev) => prev?.filter((entry) => entry.id !== id) ?? prev);
    } catch {
      setError("Não foi possível remover a candidatura.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Seja um Patrocinador" title="Candidaturas de Patrocínio" />

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!entries ? (
        <LoadingState label="Carregando candidaturas" />
      ) : entries.length === 0 ? (
        <EmptyState label="Nenhuma candidatura ainda." />
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border border-ink/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,18,16,0.05)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">{entry.company_name}</p>
                  <p className="text-sm text-stone">
                    {entry.contact_name} {entry.sponsorship_tier ? `· ${entry.sponsorship_tier}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-stone">
                    {entry.email} · {entry.phone}
                  </p>
                  {entry.website ? (
                    <a
                      href={entry.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-gold hover:underline"
                    >
                      {entry.website}
                    </a>
                  ) : null}
                  {entry.message ? <p className="mt-2 max-w-xl text-sm text-ink/80">{entry.message}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={entry.status} />
                  <StatusSelect
                    value={entry.status}
                    options={STATUS_OPTIONS}
                    labels={STATUS_LABELS}
                    disabled={updatingId === entry.id}
                    onChange={(status) => handleStatusChange(entry.id, status)}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                <p className="text-xs text-stone">Recebido em {formatDateTime(entry.created_at)}</p>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="font-data text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline disabled:opacity-50"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
