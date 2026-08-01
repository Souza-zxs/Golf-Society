"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MembershipFormValues } from "./membership-form";
import { useCardTilt } from "../motion/use-card-tilt";

type Row = { key: string; label: string; value: string };

const ROW_TRANSITION = { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };

function CardRow({ row }: { row: Row }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={ROW_TRANSITION}
      className="overflow-hidden border-b border-gold-soft/15 last:border-b-0"
    >
      <div className="flex items-baseline justify-between gap-6 px-5 py-3.5">
        <span className="font-data shrink-0 text-[10px] uppercase tracking-[0.2em] text-mist">
          {row.label}
        </span>
        <motion.span
          key={row.value}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="font-data text-right text-sm text-ivory"
        >
          {row.value}
        </motion.span>
      </div>
    </motion.div>
  );
}

function CardSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute -bottom-5 -right-5 h-16 w-16"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_4px_12px_rgba(176,141,62,0.45)]">
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="var(--color-ink-2)"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.1 }}
        />
        <motion.text
          x="32"
          y="36"
          textAnchor="middle"
          fill="var(--color-gold)"
          fontSize="13"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          SSG
        </motion.text>
      </svg>
    </motion.div>
  );
}

export function LiveMembershipCard({
  values,
  sealed,
}: {
  values: MembershipFormValues;
  sealed: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const { rotateX, rotateY, gloss, onMouseMove, onMouseLeave } = useCardTilt(!!reduceMotion);

  const profile = [values.company.trim(), values.role.trim()].filter(Boolean).join(" · ");
  const linkedin = values.linkedin_url.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const motivationLength = values.motivation.trim().length;

  const rows: Row[] = [];
  if (values.name.trim()) rows.push({ key: "name", label: "Sócio", value: values.name.trim() });
  if (profile) rows.push({ key: "profile", label: "Perfil", value: profile });
  if (values.city.trim()) rows.push({ key: "city", label: "Base", value: values.city.trim() });
  if (linkedin) rows.push({ key: "linkedin", label: "LinkedIn", value: linkedin });
  if (motivationLength > 0) {
    rows.push({
      key: "motivation",
      label: "Motivação",
      value: motivationLength >= 20 ? "Registrada" : `${motivationLength}/20`,
    });
  }

  const isEmpty = rows.length === 0;

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        className="relative"
        style={{ rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          onMouseLeave();
          setHovered(false);
        }}
        animate={{ y: hovered && !reduceMotion ? -6 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`relative overflow-hidden border bg-ink-2/60 shadow-[0_20px_45px_-22px_rgba(0,0,0,0.6)] transition-[border-color,box-shadow] duration-500 ${
            sealed ? "border-gold/60" : "border-gold-soft/30"
          } ${hovered ? "shadow-[0_34px_65px_-24px_rgba(0,0,0,0.72)]" : ""}`}
        >
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: gloss }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : null}

          <div className="relative flex items-center justify-between border-b border-gold-soft/15 px-5 py-4">
            <span className="font-data text-[10px] uppercase tracking-[0.24em] text-gold-soft">
              Cartão de Sócio
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={sealed ? "sealed" : "draft"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`font-data text-[10px] uppercase tracking-[0.2em] ${
                  sealed ? "text-gold" : "text-mist/70"
                }`}
              >
                {sealed ? "Selado" : "Rascunho"}
              </motion.span>
            </AnimatePresence>
          </div>

          {isEmpty ? (
            <p className="relative font-data px-5 py-8 text-xs uppercase tracking-[0.16em] text-mist/70">
              Seu cartão aparece aqui conforme você preenche a candidatura ao lado.
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <CardRow key={row.key} row={row} />
              ))}
            </AnimatePresence>
          )}
        </div>

        <AnimatePresence>{sealed ? <CardSeal /> : null}</AnimatePresence>
      </motion.div>
    </div>
  );
}
