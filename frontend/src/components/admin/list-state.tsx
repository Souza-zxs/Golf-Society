import { InboxIcon, SpinnerIcon } from "./icons";

export function LoadingState({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 border border-ink/10 bg-white px-5 py-8 text-sm text-stone">
      <SpinnerIcon className="h-4 w-4 motion-safe:animate-spin" />
      {label}…
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 border border-ink/10 bg-white px-5 py-12 text-center text-sm text-stone">
      <InboxIcon className="h-6 w-6 text-stone/60" />
      {label}
    </div>
  );
}
