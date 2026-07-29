import { ReactNode } from "react";
import { Reveal } from "../motion/reveal";
import { LineDraw } from "../motion/line-draw";

export function LedgerCard({
  children,
  tone = "dark",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal
      delay={delay}
      className={`border ${
        tone === "dark" ? "border-gold-soft/30 bg-ink-2/60" : "border-ink/15 bg-ivory-2"
      } ${className}`}
    >
      <LineDraw tone={tone} />
      {children}
    </Reveal>
  );
}

export function LedgerRow({
  label,
  value,
  tone = "dark",
}: {
  label: string;
  value: string;
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 border-b px-5 py-3.5 last:border-b-0 ${
        tone === "dark" ? "border-gold-soft/15" : "border-ink/10"
      }`}
    >
      <span
        className={`font-data text-[10px] uppercase tracking-[0.2em] ${
          tone === "dark" ? "text-mist" : "text-stone"
        }`}
      >
        {label}
      </span>
      <span className={`font-data text-sm ${tone === "dark" ? "text-ivory" : "text-ink"}`}>{value}</span>
    </div>
  );
}
