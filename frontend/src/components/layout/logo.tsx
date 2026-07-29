import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" className="group inline-flex flex-col leading-none">
      <span
        className={`font-display text-xl italic tracking-tight ${tone === "dark" ? "text-ivory" : "text-ink"}`}
      >
        Sellers Society
      </span>
      <span className="font-data mt-1 text-[10px] tracking-[0.4em] text-gold transition-[letter-spacing] duration-500 group-hover:tracking-[0.55em]">
        GOLF
      </span>
    </Link>
  );
}
