"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Pillar = { label: string; title: string; description: string };

export function PillarTabs({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);
  const current = pillars[active];

  return (
    <div>
      <div className="flex flex-wrap gap-x-10 gap-y-4 border-b border-gold-soft/15">
        {pillars.map((pillar, index) => {
          const isActive = index === active;
          return (
            <button
              key={pillar.label}
              type="button"
              onClick={() => setActive(index)}
              className={`font-data relative pb-4 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                isActive ? "text-gold" : "text-mist hover:text-ivory"
              }`}
            >
              {pillar.label}
              {isActive ? (
                <motion.span
                  layoutId="pillar-tab-underline"
                  className="absolute -bottom-px left-0 h-px w-full bg-gold"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="relative mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display text-3xl text-ivory sm:text-4xl">{current.title}</h3>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-mist">{current.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
