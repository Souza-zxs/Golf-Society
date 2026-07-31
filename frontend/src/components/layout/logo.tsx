import Image from "next/image";
import Link from "next/link";
import sgIsologo from "../../../public/sg-isologo.png";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3">
      <Image src={sgIsologo} alt="" aria-hidden width={34} height={43} className="h-9 w-auto shrink-0" priority />
      <span className="inline-flex flex-col leading-none">
        <span
          className={`font-display text-xl italic tracking-tight ${tone === "dark" ? "text-ivory" : "text-ink"}`}
        >
          Sellers Society
        </span>
        <span className="font-data mt-1 text-[10px] tracking-[0.4em] text-gold transition-[letter-spacing] duration-500 group-hover:tracking-[0.55em]">
          GOLF
        </span>
      </span>
    </Link>
  );
}
