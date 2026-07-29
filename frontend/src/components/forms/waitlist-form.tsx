"use client";

import { FormEvent, useState } from "react";
import { api, ApiError, WaitlistPayload } from "@/lib/api";
import { Button } from "../ui/button";
import { TextField, TextAreaField, FormNotice } from "./field";

export function WaitlistForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: WaitlistPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? "") || undefined,
      role: String(data.get("role") ?? "") || undefined,
      city: String(data.get("city") ?? "") || undefined,
      referred_by: String(data.get("referred_by") ?? "") || undefined,
      message: String(data.get("message") ?? "") || undefined,
    };

    try {
      await api.waitlist.create(payload);
      setStatus({ type: "success", message: "Recebido. Nossa equipe entra em contato em breve." });
      form.reset();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erro inesperado. Tente novamente.";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Nome completo" name="name" required autoComplete="name" />
        <TextField label="E-mail" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Telefone / WhatsApp" name="phone" required autoComplete="tel" />
        <TextField label="Empresa" name="company" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Cargo" name="role" />
        <TextField label="Cidade" name="city" />
      </div>
      <TextField label="Indicado por (opcional)" name="referred_by" />
      <TextAreaField label="O que te traz até a Sellers Society Golf" name="message" rows={4} />

      <FormNotice status={status} />

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Enviando…" : "Solicitar Convite"}
      </Button>
    </form>
  );
}
