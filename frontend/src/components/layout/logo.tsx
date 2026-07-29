import Image from "next/image";
import Link from "next/link";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const mark = tone === "dark" ? "/brand/logo-white.png" : "/brand/logo-gold.png";

  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <Image src={mark} alt="" width={36} height={46} className="h-9 w-auto" priority />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-xl italic tracking-tight ${tone === "dark" ? "text-ivory" : "text-ink"}`}
        >
          Sellers Society
        </span>
        <span className="font-data mt-1 text-[10px] tracking-[0.4em] text-gold">GOLF</span>
      </span>
    </Link>
  );
}
