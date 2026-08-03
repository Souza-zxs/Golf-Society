"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FormNotice } from "@/components/forms/field";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabaseBrowser.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
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
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-mist">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
              autoComplete="email"
              className="w-full border border-gold-line bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-mist/50 focus:border-gold focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-data text-[11px] uppercase tracking-[0.18em] text-mist">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gold-line bg-transparent px-4 py-3 text-sm text-ivory placeholder:text-mist/50 focus:border-gold focus:outline-none"
            />
          </label>

          <FormNotice status={error ? { type: "error", message: error } : null} />

          <Button type="submit" variant="solid" disabled={loading || !email.trim() || !password}>
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </Container>
    </div>
  );
}
