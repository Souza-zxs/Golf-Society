"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, adminApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormNotice } from "@/components/forms/field";

export default function AdminLoginPage() {
  const { setKey } = useAdminAuth();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sem sessão/JWT nesta fase: validamos a chave testando uma chamada
      // administrativa real. Se responder 200, a chave é válida.
      await adminApi.waitlist.list(value.trim());
      setKey(value.trim());
      router.replace("/admin");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Chave inválida.");
      } else {
        setError("Não foi possível conectar à API. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink py-16">
      <Container className="max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-gold-line bg-ink-2 p-8">
          <div>
            <p className="font-display text-xl text-ivory">Sellers Society Golf</p>
            <p className="font-data mt-1 text-[11px] uppercase tracking-[0.18em] text-gold-soft">Painel Admin</p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-mist">Admin API Key</span>
            <input
              type="password"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              required
              autoFocus
              className="w-full border border-gold-line bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-mist/50 focus:border-gold focus:outline-none"
            />
          </label>

          <FormNotice status={error ? { type: "error", message: error } : null} />

          <Button type="submit" variant="solid" disabled={loading || !value.trim()}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Container>
    </div>
  );
}
