const STYLES: Record<string, string> = {
  pending: "border-stone/40 text-stone",
  under_review: "border-gold/50 text-gold",
  approved: "border-green/50 text-green",
  rejected: "border-red-800/40 text-red-800",
  draft: "border-stone/40 text-stone",
  published: "border-green/50 text-green",
  open: "border-green/50 text-green",
  booked: "border-gold/50 text-gold",
  cancelled: "border-red-800/40 text-red-800",
  upcoming: "border-gold/50 text-gold",
  ongoing: "border-green/50 text-green",
  completed: "border-stone/40 text-stone",
};

const LABELS: Record<string, string> = {
  pending: "Pendente",
  under_review: "Em análise",
  approved: "Aprovado",
  rejected: "Rejeitado",
  draft: "Rascunho",
  published: "Publicado",
  open: "Aberto",
  booked: "Reservado",
  cancelled: "Cancelado",
  upcoming: "Em breve",
  ongoing: "Em andamento",
  completed: "Concluído",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`font-data inline-block rounded border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${
        STYLES[status] ?? "border-stone/40 text-stone"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
