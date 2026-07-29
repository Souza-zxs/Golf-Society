import { Reveal } from "./reveal";

export function LineDraw({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal
      variant="line"
      className={`h-px w-full ${tone === "dark" ? "bg-gold-soft/40" : "bg-ink/15"} ${className}`}
    />
  );
}
