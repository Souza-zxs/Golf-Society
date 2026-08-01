"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children?: ReactNode;
  variant?: "up" | "line";
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({ children, variant = "up", delay = 0, className = "", style }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={`${variant === "line" ? "reveal-line" : "reveal-up"} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </div>
  );
}
