"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ApiError, adminApi, type MeetingBooking, type MeetingSlot } from "@/lib/api";
import { useAdminFetch } from "@/lib/use-admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { FormNotice } from "@/components/forms/field";

export default function AdminMeetingsPage() {
  const adminFetch = useAdminFetch();
  const [slots, setSlots] = useState<MeetingSlot[] | null>(null);
  const [bookings, setBookings] = useState<MeetingBooking[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function load() {
    try {
      const [slotsData, bookingsData] = await Promise.all([
        adminFetch((key) => adminApi.meetings.listSlotsAdmin(key)),
        adminFetch((key) => adminApi.meetings.listBookings(key)),
      ]);
      setSlots(slotsData);
      setBookings(bookingsData);
    } catch {
      setError("Não foi possível carregar as reuniões.");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setNotice(null);

    const form = new FormData(event.currentTarget);
    const startsAtLocal = String(form.get("starts_at") ?? "");
    const endsAtLocal = String(form.get("ends_at") ?? "");
    const location = String(form.get("location") ?? "").trim();
    const capacity = Number(form.get("capacity") ?? 1);

    try {
      const created = await adminFetch((key) =>
        adminApi.meetings.createSlot(key, {
          starts_at: new Date(startsAtLocal).toISOString(),
          ends_at: new Date(endsAtLocal).toISOString(),
          location: location || undefined,
          capacity,
        }),
      );
      setSlots((prev) => (prev ? [...prev, created] : [created]));
      setNotice({ type: "success", message: "Horário criado." });
      event.currentTarget.reset();
    } catch (err) {
      setNotice({ type: "error", message: err instanceof ApiError ? err.message : "Erro ao criar horário." });
    } finally {
      setCreating(false);
    }
  }

  async function handleCancel(id: string) {
    setCancellingId(id);
    try {
      const updated = await adminFetch((key) => adminApi.meetings.cancelSlot(key, id));
      setSlots((prev) => prev?.map((slot) => (slot.id === id ? updated : slot)) ?? prev);
    } catch {
      setError("Não foi possível cancelar o horário.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">Reuniões</p>
        <h1 className="font-display mt-2 text-3xl text-ink">Horários e reservas</h1>
      </div>

      {error ? <p className="text-sm text-red-800">{error}</p> : null}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-ink">Novo horário</h2>
        <form onSubmit={handleCreate} className="grid gap-4 border border-ink/10 bg-white/40 p-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Início *</span>
            <input
              type="datetime-local"
              name="starts_at"
              required
              className="border border-ink/20 bg-transparent px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Fim *</span>
            <input
              type="datetime-local"
              name="ends_at"
              required
              className="border border-ink/20 bg-transparent px-3 py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Local</span>
            <input name="location" className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">Capacidade</span>
            <input
              type="number"
              name="capacity"
              min={1}
              max={50}
              defaultValue={1}
              className="border border-ink/20 bg-transparent px-3 py-2 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <FormNotice status={notice} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={creating}>
              {creating ? "Criando…" : "Criar horário"}
            </Button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-ink">Horários</h2>
        {!slots ? (
          <p className="text-sm text-stone">Carregando…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-stone">Nenhum horário cadastrado.</p>
        ) : (
          <div className="overflow-x-auto border border-ink/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-ink/5 font-data text-[11px] uppercase tracking-[0.14em] text-stone">
                <tr>
                  <th className="px-4 py-3">Início</th>
                  <th className="px-4 py-3">Fim</th>
                  <th className="px-4 py-3">Local</th>
                  <th className="px-4 py-3">Capacidade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id} className="border-t border-ink/10">
                    <td className="px-4 py-3">{formatDateTime(slot.starts_at)}</td>
                    <td className="px-4 py-3">{formatDateTime(slot.ends_at)}</td>
                    <td className="px-4 py-3 text-stone">{slot.location ?? "—"}</td>
                    <td className="px-4 py-3 text-stone">{slot.capacity}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={slot.status} />
                    </td>
                    <td className="px-4 py-3">
                      {slot.status === "open" ? (
                        <button
                          onClick={() => handleCancel(slot.id)}
                          disabled={cancellingId === slot.id}
                          className="font-data text-[11px] uppercase tracking-[0.14em] text-red-800 hover:underline"
                        >
                          Cancelar
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-ink">Reservas</h2>
        {!bookings ? (
          <p className="text-sm text-stone">Carregando…</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-stone">Nenhuma reserva ainda.</p>
        ) : (
          <div className="overflow-x-auto border border-ink/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-ink/5 font-data text-[11px] uppercase tracking-[0.14em] text-stone">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Contato</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Horário</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-ink/10">
                    <td className="px-4 py-3">{booking.name}</td>
                    <td className="px-4 py-3 text-stone">
                      <p>{booking.email}</p>
                      <p>{booking.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-stone">{booking.company ?? "—"}</td>
                    <td className="px-4 py-3 text-stone">
                      {booking.meeting_slots ? formatDateTime(booking.meeting_slots.starts_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
