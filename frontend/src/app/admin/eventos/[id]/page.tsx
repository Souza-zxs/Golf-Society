"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, adminApi, api, type EventPartner, type EventStatus, type SsgEvent } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { Button } from "@/components/ui/button";
import { TextField, TextAreaField, SelectField, FormNotice } from "@/components/forms/field";
import { STATUS_LABELS } from "@/components/admin/status-badge";
import { PageHeader } from "@/components/admin/page-header";
import { LoadingState, EmptyState } from "@/components/admin/list-state";

const STATUS_OPTIONS: EventStatus[] = ["upcoming", "ongoing", "completed", "cancelled"];

export default function AdminEventFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "novo";
  const adminFetch = useAdminFetch();
  const router = useRouter();

  const [event, setEvent] = useState<SsgEvent | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const { data } = await api.events.list({ pageSize: 50 });
        if (cancelled) return;
        const found = data.find((e) => e.id === id);
        if (!found) setNotice({ type: "error", message: "Evento não encontrado." });
        else setEvent(found);
      } catch {
        if (!cancelled) setNotice({ type: "error", message: "Não foi possível carregar o evento." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  async function handleSubmit(event_: FormEvent<HTMLFormElement>) {
    event_.preventDefault();
    setSaving(true);
    setNotice(null);

    const form = new FormData(event_.currentTarget);
    const maxAttendees = String(form.get("max_attendees") ?? "").trim();
    const payload = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim(),
      description: String(form.get("description") ?? "").trim() || undefined,
      event_date: String(form.get("event_date") ?? "").trim(),
      start_time: String(form.get("start_time") ?? "").trim() || undefined,
      end_time: String(form.get("end_time") ?? "").trim() || undefined,
      location: String(form.get("location") ?? "").trim() || undefined,
      address: String(form.get("address") ?? "").trim() || undefined,
      status: String(form.get("status") ?? "upcoming") as EventStatus,
      cover_image_url: String(form.get("cover_image_url") ?? "").trim() || undefined,
      max_attendees: maxAttendees ? Number(maxAttendees) : undefined,
    };

    try {
      if (isNew) {
        const created = await adminFetch((key) => adminApi.events.create(key, payload));
        router.push(`/admin/eventos/${created.id}`);
      } else {
        await adminFetch((key) => adminApi.events.update(key, id, payload));
        setNotice({ type: "success", message: "Evento atualizado." });
      }
    } catch (err) {
      setNotice({ type: "error", message: err instanceof ApiError ? err.message : "Erro ao salvar o evento." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Carregando evento" />;

  return (
    <div className="flex max-w-2xl flex-col gap-10">
      <PageHeader eyebrow="Eventos" title={isNew ? "Novo evento" : "Editar evento"} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <TextField label="Título" name="title" required defaultValue={event?.title} />
        <TextField label="Slug" name="slug" required defaultValue={event?.slug} />
        <TextAreaField label="Descrição" name="description" rows={5} defaultValue={event?.description ?? ""} />

        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Data" name="event_date" type="date" required defaultValue={event?.event_date} />
          <TextField label="Início" name="start_time" type="time" defaultValue={event?.start_time ?? ""} />
          <TextField label="Fim" name="end_time" type="time" defaultValue={event?.end_time ?? ""} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Local" name="location" defaultValue={event?.location ?? ""} />
          <TextField label="Endereço" name="address" defaultValue={event?.address ?? ""} />
        </div>

        <TextField
          label="URL da imagem de capa"
          name="cover_image_url"
          type="url"
          defaultValue={event?.cover_image_url ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Status" name="status" defaultValue={event?.status ?? "upcoming"}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status] ?? status}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Máx. participantes"
            name="max_attendees"
            type="number"
            min={1}
            defaultValue={event?.max_attendees ?? undefined}
          />
        </div>

        <FormNotice status={notice} />

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </form>

      {!isNew ? <PartnersSection eventId={id} /> : null}
    </div>
  );
}

function PartnersSection({ eventId }: { eventId: string }) {
  const adminFetch = useAdminFetch();
  const [partners, setPartners] = useState<EventPartner[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<EventPartner | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function load() {
    try {
      const data = await adminFetch((key) => adminApi.events.listPartners(key, eventId));
      setPartners(data);
    } catch {
      setError("Não foi possível carregar os parceiros.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function handleDelete(id: string) {
    if (!window.confirm("Remover este parceiro?")) return;
    try {
      await adminFetch((key) => adminApi.events.deletePartner(key, eventId, id));
      setPartners((prev) => prev?.filter((p) => p.id !== id) ?? prev);
    } catch {
      setError("Não foi possível remover o parceiro.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim(),
      logo_url: String(form.get("logo_url") ?? "").trim(),
      website: String(form.get("website") ?? "").trim() || undefined,
      tier: String(form.get("tier") ?? "").trim() || undefined,
      display_order: Number(form.get("display_order") ?? 0),
    };

    try {
      if (editing) {
        const updated = await adminFetch((key) => adminApi.events.updatePartner(key, eventId, editing.id, payload));
        setPartners((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? prev);
        setEditing(null);
      } else {
        const created = await adminFetch((key) => adminApi.events.createPartner(key, eventId, payload));
        setPartners((prev) => (prev ? [...prev, created] : [created]));
      }
      event.currentTarget.reset();
      setNotice({ type: "success", message: "Salvo." });
    } catch (err) {
      setNotice({ type: "error", message: err instanceof ApiError ? err.message : "Erro ao salvar parceiro." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-4 border-t border-ink/10 pt-8">
      <h2 className="font-display text-xl text-ink">Parceiros confirmados</h2>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      {!partners ? (
        <LoadingState label="Carregando parceiros" />
      ) : partners.length === 0 ? (
        <EmptyState label="Nenhum parceiro ainda." />
      ) : (
        <ul className="flex flex-col gap-2">
          {partners.map((partner) => (
            <li
              key={partner.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-ink/10 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(14,18,16,0.05)]"
            >
              <div>
                <p className="text-sm font-medium text-ink">{partner.name}</p>
                <p className="text-xs text-stone">
                  {partner.tier ?? "sem tier"} · ordem {partner.display_order}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(partner)}
                  className="font-data text-[11px] uppercase tracking-[0.14em] text-gold hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="font-data text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        key={editing?.id ?? "new"}
        onSubmit={handleSubmit}
        className="grid gap-4 border border-ink/10 bg-white p-5 shadow-[0_1px_3px_rgba(14,18,16,0.05)] sm:grid-cols-2"
      >
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-stone sm:col-span-2">
          {editing ? `Editando: ${editing.name}` : "Novo parceiro"}
        </p>
        <TextField label="Nome" name="name" required defaultValue={editing?.name} />
        <TextField label="URL do logo" name="logo_url" type="url" required defaultValue={editing?.logo_url ?? ""} />
        <TextField label="Website" name="website" type="url" defaultValue={editing?.website ?? ""} />
        <TextField label="Tier" name="tier" defaultValue={editing?.tier ?? ""} />
        <TextField
          label="Ordem de exibição"
          name="display_order"
          type="number"
          min={0}
          defaultValue={editing?.display_order ?? 0}
        />
        <FormNotice status={notice} />
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando…" : editing ? "Atualizar parceiro" : "Adicionar parceiro"}
          </Button>
          {editing ? (
            <Button type="button" variant="outline-light" onClick={() => setEditing(null)}>
              Cancelar edição
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
