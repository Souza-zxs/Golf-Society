export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-dashed border-ink/20 px-8 py-16 text-center">
      <p className="font-display text-2xl italic text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone">{description}</p>
    </div>
  );
}
