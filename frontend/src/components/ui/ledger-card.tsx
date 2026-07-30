"use client";

import { ReactNode, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { LineDraw } from "../motion/line-draw";
import { useCardTilt } from "../motion/use-card-tilt";

export function LedgerCard({
  children,
  tone = "dark",
  delay = 0,
  interactive = true,
  className = "",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
  delay?: number;
  interactive?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const disabled = !interactive || !!reduceMotion;
  const { rotateX, rotateY, gloss, onMouseMove, onMouseLeave } = useCardTilt(disabled, 5);

  return (
    <Reveal delay={delay} style={{ perspective: 1400 }}>
      <motion.div
        style={{
          rotateX: disabled ? 0 : rotateX,
          rotateY: disabled ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          onMouseLeave();
          setHovered(false);
        }}
        animate={{ y: hovered && !disabled ? -4 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative overflow-hidden border transition-shadow duration-500 ${
          tone === "dark" ? "border-gold-soft/30 bg-ink-2/60" : "border-ink/15 bg-ivory-2"
        } ${hovered && !disabled ? "shadow-[0_28px_55px_-24px_rgba(0,0,0,0.55)]" : ""} ${className}`}
      >
        {!disabled ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{ background: gloss }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : null}
        <LineDraw tone={tone} />
        {children}
      </motion.div>
    </Reveal>
  );
}

export function LedgerRow({
  label,
  value,
  tone = "dark",
  size = "default",
}: {
  label: string;
  value: string;
  tone?: "dark" | "light";
  size?: "default" | "lg";
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 border-b last:border-b-0 ${
        tone === "dark" ? "border-gold-soft/15" : "border-ink/10"
      } ${size === "lg" ? "px-7 py-5" : "px-5 py-3.5"}`}
    >
      <span
        className={`font-data uppercase tracking-[0.2em] ${size === "lg" ? "text-[11px]" : "text-[10px]"} ${
          tone === "dark" ? "text-mist" : "text-stone"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-data ${size === "lg" ? "text-base" : "text-sm"} ${
          tone === "dark" ? "text-ivory" : "text-ink"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
