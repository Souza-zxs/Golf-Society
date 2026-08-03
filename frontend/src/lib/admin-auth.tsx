"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";

type AdminAuthContextValue = {
  key: string | null;
  hydrated: boolean;
  clear: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setKey(data.session?.access_token ?? null);
      setHydrated(true);
    });

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setKey(session?.access_token ?? null);
      setHydrated(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  function clear() {
    supabaseBrowser.auth.signOut();
  }

  return <AdminAuthContext.Provider value={{ key, hydrated, clear }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}
