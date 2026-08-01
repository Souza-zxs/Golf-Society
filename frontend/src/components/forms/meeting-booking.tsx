"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError, MeetingBookingPayload, MeetingSlot } from "@/lib/api";
import { Button } from "../ui/button";
import { TextField, FormNotice } from "./field";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatSlot(slot: MeetingSlot) {
  const start = new Date(slot.starts_at);
  const end = new Date(slot.ends_at);
  return `${dateFormatter.format(start)} · ${timeFormatter.format(start)}–${timeFormatter.format(end)}`;
}

type LoadState = "loading" | "ready" | "error";

export function MeetingBooking() {
  const [slots, setSlots] = useState<MeetingSlot[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    api.meetings
      .listSlots()
      .then((data) => {
        if (!cancelled) {
          setSlots(data);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlotId) return;

    setSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: MeetingBookingPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? "") || undefined,
      notes: String(data.get("notes") ?? "") || undefined,
    };

    try {
      await api.meetings.book(selectedSlotId, payload);
      setStatus({ type: "success", message: "Conversa agendada. Você recebe a confirmação por e-mail." });
      form.reset();
      setSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotId));
      setSelectedSlotId(null);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.status === 409
            ? "Esse horário acabou de ser reservado por outra pessoa. Escolha outro."
            : error.message
          : "Erro inesperado. Tente novamente.";
      setStatus({ type: "error", message });
      if (error instanceof ApiError && error.status === 409) {
        setSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotId));
        setSelectedSlotId(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loadState === "loading") {
    return <p className="font-data text-xs uppercase tracking-[0.18em] text-stone">Carregando horários…</p>;
  }

  if (loadState === "error") {
    return (
      <p className="font-data text-xs uppercase tracking-[0.18em] text-stone">
        Não foi possível carregar os horários agora. Fale conosco pelo WhatsApp ou envie uma mensagem abaixo.
      </p>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="font-data text-xs uppercase tracking-[0.18em] text-stone">
        Nenhum horário disponível no momento. Deixe seus dados que retornamos com novas opções.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col border border-ink/15">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => setSelectedSlotId(slot.id)}
            aria-pressed={selectedSlotId === slot.id}
            className={`font-data flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-3.5 text-left text-xs uppercase tracking-[0.14em] transition-colors last:border-b-0 ${
              selectedSlotId === slot.id ? "bg-gold text-ink" : "text-ink hover:bg-ink/5"
            }`}
          >
            <span>{formatSlot(slot)}</span>
            <span>{slot.location ?? "A definir"}</span>
          </button>
        ))}
      </div>

      {selectedSlotId ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nome completo" name="name" required autoComplete="name" />
            <TextField label="E-mail" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Telefone / WhatsApp" name="phone" required autoComplete="tel" />
            <TextField label="Empresa (opcional)" name="company" />
          </div>
          <TextField label="Alguma pauta específica? (opcional)" name="notes" />

          <FormNotice status={status} />

          <Button type="submit" variant="outline-light" disabled={submitting} className="self-start">
            {submitting ? "Confirmando…" : "Confirmar Horário"}
          </Button>
        </form>
      ) : (
        <FormNotice status={status} />
      )}
    </div>
  );
}
