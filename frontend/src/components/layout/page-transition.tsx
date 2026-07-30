"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

// The entrance animation's final keyframe leaves `transform: translateY(0)`
// applied, which — despite being visually a no-op — still establishes a CSS
// containing block for `position: fixed` descendants (e.g. the gallery
// lightbox), trapping them inside this wrapper instead of the viewport. The
// class is dropped once the animation ends so `transform` reverts to `none`.
// Keying this frame by pathname (below) remounts it fresh on every
// navigation, so `animating` naturally resets without an effect.
function AnimatedFrame({ children }: { children: ReactNode }) {
  const [animating, setAnimating] = useState(true);

  return (
    <div className={animating ? "page-transition" : ""} onAnimationEnd={() => setAnimating(false)}>
      {children}
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <AnimatedFrame key={pathname}>{children}</AnimatedFrame>;
}
