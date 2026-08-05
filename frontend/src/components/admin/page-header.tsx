import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
      <div>
        <p className="font-data text-[11px] uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
        <h1 className="font-display mt-2 text-3xl text-ink">{title}</h1>
      </div>
      {action}
    </div>
  );
}
