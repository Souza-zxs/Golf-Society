"use client";

import { ReactNode, useEffect, useRef } from "react";

export function ParallaxLayer({
  children,
  ratio = 0.08,
  className = "",
}: {
  children?: ReactNode;
  ratio?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    function update() {
      frame = 0;
      const offset = window.scrollY * ratio;
      if (node) node.style.transform = `translateY(${Math.min(offset, 48)}px)`;
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ratio]);

  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  );
}
