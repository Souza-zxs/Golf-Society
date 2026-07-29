import { ReactNode } from "react";

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`font-data inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] ${
        tone === "dark" ? "text-gold-soft" : "text-gold"
      }`}
    >
      <span className={`h-px w-8 ${tone === "dark" ? "bg-gold-soft/60" : "bg-gold/60"}`} aria-hidden />
      {children}
    </span>
  );
}
