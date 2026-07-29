import { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Eyebrow tone={tone === "dark" ? "dark" : "light"}>{eyebrow}</Eyebrow>
      <h2
        className={`font-display mt-5 text-4xl leading-[1.1] tracking-tight sm:text-5xl ${
          tone === "dark" ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-relaxed ${tone === "dark" ? "text-mist" : "text-stone"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
