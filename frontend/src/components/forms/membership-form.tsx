"use client";

import { FormEvent, useState } from "react";
import { api, ApiError, MembershipPayload } from "@/lib/api";
import { Button } from "../ui/button";
import { TextField, TextAreaField, FormNotice } from "./field";

export function MembershipForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: MembershipPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      company: String(data.get("company") ?? ""),
      role: String(data.get("role") ?? ""),
      linkedin_url: String(data.get("linkedin_url") ?? "") || undefined,
      city: String(data.get("city") ?? "") || undefined,
      motivation: String(data.get("motivation") ?? ""),
    };

    try {
      await api.membership.create(payload);
      setStatus({
        type: "success",
        message: "Candidatura recebida. Nosso comitê analisa e retorna em até 5 dias úteis.",
      });
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
        <TextField label="Cidade" name="city" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Empresa" name="company" required />
        <TextField label="Cargo" name="role" required />
      </div>
      <TextField label="LinkedIn (opcional)" name="linkedin_url" type="url" placeholder="https://linkedin.com/in/…" />
      <TextAreaField
        label="Por que você quer fazer parte da Sellers Society Golf"
        name="motivation"
        required
        rows={6}
        placeholder="Conte sobre sua trajetória, seus objetivos de negócio e o que espera da comunidade (mín. 20 caracteres)."
      />

      <FormNotice status={status} />

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Enviando…" : "Enviar Candidatura"}
      </Button>
    </form>
  );
}
