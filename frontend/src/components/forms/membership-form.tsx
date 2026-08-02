"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, ApiError, MembershipPayload } from "@/lib/api";
import { Button } from "../ui/button";
import { TextField, TextAreaField, FormNotice } from "./field";

export type MembershipFormValues = {
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  role: string;
  linkedin_url: string;
  motivation: string;
};

export const EMPTY_MEMBERSHIP_VALUES: MembershipFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  company: "",
  role: "",
  linkedin_url: "",
  motivation: "",
};

export function MembershipForm({
  onValuesChange,
  onSealedChange,
}: {
  onValuesChange?: (values: MembershipFormValues) => void;
  onSealedChange?: (sealed: boolean) => void;
} = {}) {
  const [values, setValues] = useState<MembershipFormValues>(EMPTY_MEMBERSHIP_VALUES);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const sealed = status?.type === "success";

  useEffect(() => {
    onValuesChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  function update<K extends keyof MembershipFormValues>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function startOver() {
    setValues(EMPTY_MEMBERSHIP_VALUES);
    setStatus(null);
    onSealedChange?.(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const payload: MembershipPayload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      role: values.role,
      linkedin_url: values.linkedin_url || undefined,
      city: values.city || undefined,
      motivation: values.motivation,
    };

    try {
      await api.membership.create(payload);
      setStatus({
        type: "success",
        message: "Candidatura recebida. Nosso comitê analisa e retorna em até 5 dias úteis.",
      });
      onSealedChange?.(true);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Erro inesperado. Tente novamente.";
      setStatus({ type: "error", message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <fieldset disabled={sealed} className="flex flex-col gap-5 disabled:opacity-60">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Nome completo"
            name="name"
            required
            autoComplete="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <TextField
            label="E-mail"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Telefone / WhatsApp"
            name="phone"
            required
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <TextField
            label="Cidade"
            name="city"
            value={values.city}
            onChange={(e) => update("city", e.target.value)}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Empresa"
            name="company"
            required
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
          />
          <TextField
            label="Cargo"
            name="role"
            required
            value={values.role}
            onChange={(e) => update("role", e.target.value)}
          />
        </div>
        <TextField
          label="LinkedIn (opcional)"
          name="linkedin_url"
          type="url"
          placeholder="https://linkedin.com/in/…"
          value={values.linkedin_url}
          onChange={(e) => update("linkedin_url", e.target.value)}
        />
        <TextAreaField
          label="Por que você quer fazer parte da Sellers Society Golf"
          name="motivation"
          required
          rows={6}
          placeholder="Conte sobre sua trajetória, os objetivos da sua marca e o que espera da comunidade (mín. 20 caracteres)."
          value={values.motivation}
          onChange={(e) => update("motivation", e.target.value)}
        />
      </fieldset>

      <FormNotice status={status} />

      {sealed ? (
        <Button type="button" variant="outline-light" onClick={startOver} className="self-start">
          Nova Candidatura
        </Button>
      ) : (
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? "Enviando…" : "Enviar Candidatura"}
        </Button>
      )}
    </form>
  );
}
