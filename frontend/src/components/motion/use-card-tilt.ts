"use client";

import { MouseEvent } from "react";
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

const TILT_SPRING = { stiffness: 200, damping: 24, mass: 0.6 };

export function useCardTilt(disabled: boolean, degrees = 8) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [degrees, -degrees]), TILT_SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-degrees, degrees]), TILT_SPRING);
  const glossX = useTransform(px, [-0.5, 0.5], ["6%", "94%"]);
  const glossY = useTransform(py, [-0.5, 0.5], ["6%", "94%"]);
  const gloss = useMotionTemplate`radial-gradient(220px circle at ${glossX} ${glossY}, rgba(217,192,138,0.2), transparent 70%)`;

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    px.set(0);
    py.set(0);
  }

  return { rotateX, rotateY, gloss, onMouseMove, onMouseLeave };
}
