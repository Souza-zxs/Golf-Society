"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "../motion/reveal";
import { GalleryPhoto } from "@/lib/api";

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => {
      setActiveIndex((current) => {
        if (current === null) return current;
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, step]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <Reveal key={photo.id} delay={(index % 4) * 80}>
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={photo.title ? `Ampliar foto: ${photo.title}` : "Ampliar foto"}
              className="group relative block aspect-square w-full overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.image_url}
                alt={photo.title ?? ""}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
              <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-gold-soft/50" />
              {photo.title ? (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-ink/85 to-transparent px-3 pb-3 pt-8 text-left text-xs text-ivory opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.title}
                </span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.title ?? "Foto ampliada"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
            onClick={() => setActiveIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Fechar"
              className="font-data absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-gold-soft/30 text-[10px] uppercase text-ivory transition-colors hover:border-gold-soft/60"
            >
              Fechar
            </button>

            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Foto anterior"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold-soft/30 text-lg text-ivory transition-colors hover:border-gold-soft/60 sm:left-6"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Próxima foto"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-gold-soft/30 text-lg text-ivory transition-colors hover:border-gold-soft/60 sm:right-6"
                >
                  →
                </button>
              </>
            ) : null}

            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-4xl border border-gold-soft/20 bg-ink-2 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.image_url}
                alt={active.title ?? ""}
                className="max-h-[72vh] w-full object-contain"
              />
              {active.title ? (
                <p className="font-data mt-1 px-2 pb-2 text-[11px] uppercase tracking-[0.2em] text-mist">
                  {active.title}
                </p>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
