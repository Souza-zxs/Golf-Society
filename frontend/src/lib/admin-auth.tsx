"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "ssg_admin_key";

type AdminAuthContextValue = {
  key: string | null;
  hydrated: boolean;
  setKey: (key: string) => void;
  clear: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [key, setKeyState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setKeyState(window.localStorage.getItem(STORAGE_KEY));
    setHydrated(true);
  }, []);

  function setKey(value: string) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setKeyState(value);
  }

  function clear() {
    window.localStorage.removeItem(STORAGE_KEY);
    setKeyState(null);
  }

  return (
    <AdminAuthContext.Provider value={{ key, hydrated, setKey, clear }}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth deve ser usado dentro de AdminAuthProvider");
  return ctx;
}
