import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "solid" | "outline-dark" | "outline-light";

const base =
  "font-data relative inline-flex items-center justify-center gap-2 border px-6 py-3 text-[11px] uppercase tracking-[0.22em] transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-out motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  solid:
    "bg-gold border-gold text-ink hover:bg-gold-soft hover:border-gold-soft hover:shadow-[0_10px_30px_-10px_rgba(176,141,62,0.65)]",
  "outline-dark":
    "border-gold-soft/50 text-ivory hover:bg-gold-soft/10 hover:border-gold-soft hover:shadow-[0_10px_24px_-12px_rgba(217,192,138,0.35)]",
  "outline-light": "border-ink/30 text-ink hover:bg-ink hover:text-ivory hover:border-ink",
};

export function LinkButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "solid",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
