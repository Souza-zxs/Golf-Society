export function IndexCard({
  index,
  title,
  description,
  tone = "light",
  className = "",
}: {
  index: string;
  title: string;
  description: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-full flex-col overflow-hidden border p-7 ${
        tone === "dark" ? "border-gold-soft/10 bg-ink-2/50" : "border-ink/15 bg-ivory-2"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`font-display pointer-events-none absolute -right-2 -top-7 select-none text-[7rem] italic leading-none sm:text-[8rem] ${
          tone === "dark" ? "text-gold-soft/[0.08]" : "text-ink/[0.05]"
        }`}
      >
        {index}
      </span>
      <div className="relative">
        <h3 className={`font-display text-2xl ${tone === "dark" ? "text-ivory" : "text-ink"}`}>{title}</h3>
        <p className={`mt-3 text-sm leading-relaxed ${tone === "dark" ? "text-mist" : "text-stone"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
