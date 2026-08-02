"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";

// Centraliza o "cole a ADMIN_API_KEY em toda chamada" + o que fazer quando a
// chave foi revogada/expirou (a API responde 401): desloga e manda pro login
// em vez de deixar cada página do painel reimplementar esse tratamento.
export function useAdminFetch() {
  const { key, clear } = useAdminAuth();
  const router = useRouter();

  return useCallback(
    async function adminFetch<T>(fn: (adminKey: string) => Promise<T>): Promise<T> {
      if (!key) {
        router.replace("/admin/login");
        throw new ApiError("Não autenticado", 401);
      }

      try {
        return await fn(key);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clear();
          router.replace("/admin/login");
        }
        throw error;
      }
    },
    [key, clear, router],
  );
}
