"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type Contour = { d: string; width: number; opacity: number; driftY: number };

// Alternating bolder "index" lines, like a real topographic map.
const CONTOURS: Contour[] = [
  { d: "M-40,70 C150,25 290,120 470,65 S 810,10 960,80", width: 1, opacity: 0.1, driftY: 6 },
  { d: "M-40,130 C170,95 330,185 510,125 S 830,70 960,140", width: 1.6, opacity: 0.24, driftY: -5 },
  { d: "M-40,190 C185,165 345,245 525,185 S 845,140 960,200", width: 1, opacity: 0.12, driftY: 7 },
  { d: "M-40,250 C195,225 355,300 535,245 S 855,205 960,260", width: 1, opacity: 0.09, driftY: -6 },
  { d: "M-40,310 C205,285 365,355 545,305 S 865,265 960,320", width: 1.6, opacity: 0.2, driftY: 5 },
];

const POINTER_SPRING = { stiffness: 45, damping: 18 };
const SPOTLIGHT_SPRING = { stiffness: 120, damping: 22, mass: 0.5 };

export function ContourField({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [litUp, setLitUp] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const pointerX = useSpring(useTransform(px, [0, 1], [-16, 16]), POINTER_SPRING);
  const pointerY = useSpring(useTransform(py, [0, 1], [-10, 10]), POINTER_SPRING);

  // Spotlight lives in the same 0..920 / 0..360 viewBox space as the paths
  // themselves, so it can sit inside a <mask> and reveal the brighter
  // "gold" copy of the terrain wherever the cursor is — like a torch
  // sweeping over a topographic map.
  const spotX = useSpring(useTransform(px, [0, 1], [0, 920]), SPOTLIGHT_SPRING);
  const spotY = useSpring(useTransform(py, [0, 1], [0, 360]), SPOTLIGHT_SPRING);

  useEffect(() => {
    if (reduceMotion) return;

    function onMouseMove(event: MouseEvent) {
      px.set(event.clientX / window.innerWidth);
      py.set(event.clientY / window.innerHeight);
      if (!litUp) setLitUp(true);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [reduceMotion, px, py, litUp]);

  return (
    <motion.svg
      className={className}
      viewBox="0 0 920 360"
      preserveAspectRatio="none"
      aria-hidden
      style={{ x: reduceMotion ? 0 : pointerX, y: reduceMotion ? 0 : pointerY }}
    >
      {!reduceMotion ? (
        <defs>
          <radialGradient id="contour-spotlight-fill">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="contour-spotlight-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="920" height="360">
            <motion.circle cx={spotX} cy={spotY} r={150} fill="url(#contour-spotlight-fill)" />
          </mask>
        </defs>
      ) : null}

      {CONTOURS.map((contour, index) => {
        const driftTransition = {
          x: { duration: 26 + index * 5, repeat: Infinity, ease: "easeInOut" as const, delay: index * 0.7 },
          y: { duration: 20 + index * 4, repeat: Infinity, ease: "easeInOut" as const, delay: index * 0.5 },
        };
        const driftAnimate = {
          x: reduceMotion ? 0 : [0, 20, 0],
          y: reduceMotion ? 0 : [0, contour.driftY, 0],
        };

        return (
          <motion.path
            key={contour.d}
            d={contour.d}
            fill="none"
            stroke="var(--color-gold-soft)"
            strokeWidth={contour.width}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: contour.opacity, ...driftAnimate }}
            transition={{
              // Opacity only fades in once — kept separate from the drift loops
              // below so a loop restart never snaps it back to invisible.
              opacity: { duration: 1.8, delay: index * 0.18, ease: "easeOut" },
              ...driftTransition,
            }}
          />
        );
      })}

      {!reduceMotion ? (
        <motion.g
          mask="url(#contour-spotlight-mask)"
          animate={{ opacity: litUp ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {CONTOURS.map((contour, index) => (
            <motion.path
              key={`lit-${contour.d}`}
              d={contour.d}
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth={contour.width + 0.4}
              opacity={0.9}
              animate={{
                x: [0, 20, 0],
                y: [0, contour.driftY, 0],
              }}
              transition={{
                x: { duration: 26 + index * 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 },
                y: { duration: 20 + index * 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              }}
            />
          ))}
        </motion.g>
      ) : null}
    </motion.svg>
  );
}
