"use client";

import { FormEvent, useState } from "react";
import { api, ApiError, SponsorshipPayload } from "@/lib/api";
import { Button } from "../ui/button";
import { TextField, TextAreaField, FormNotice } from "./field";

const TIERS = ["Patrocinador Master", "Patrocinador Torneio", "Patrocinador Apoiador"];

export function SponsorshipForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: SponsorshipPayload = {
      company_name: String(data.get("company_name") ?? ""),
      contact_name: String(data.get("contact_name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      website: String(data.get("website") ?? "") || undefined,
      sponsorship_tier: String(data.get("sponsorship_tier") ?? "") || undefined,
      message: String(data.get("message") ?? "") || undefined,
    };

    try {
      await api.sponsorship.create(payload);
      setStatus({ type: "success", message: "Proposta recebida. Nosso time comercial retorna em breve." });
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
        <TextField label="Empresa" name="company_name" required autoComplete="organization" />
        <TextField label="Nome do contato" name="contact_name" required autoComplete="name" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="E-mail" name="email" type="email" required autoComplete="email" />
        <TextField label="Telefone / WhatsApp" name="phone" required autoComplete="tel" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Site (opcional)" name="website" type="url" placeholder="https://" />
        <label className="flex flex-col gap-2">
          <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">
            Modalidade de interesse
          </span>
          <select
            name="sponsorship_tier"
            defaultValue=""
            className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="">A definir com nosso time</option>
            {TIERS.map((tier) => (
              <option key={tier} value={tier}>
                {tier}
              </option>
            ))}
          </select>
        </label>
      </div>
      <TextAreaField
        label="Conte sobre a proposta"
        name="message"
        rows={5}
        placeholder="Objetivos da marca, formatos de ativação de interesse, orçamento estimado…"
      />

      <FormNotice status={status} />

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Enviando…" : "Enviar Proposta"}
      </Button>
    </form>
  );
}
