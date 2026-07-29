import { EventPartner } from "@/lib/api";
import { Reveal } from "@/components/motion/reveal";
import { LineDraw } from "@/components/motion/line-draw";
import { PartnerMark } from "./partner-mark";

function PartnerRow({ partner, tone }: { partner: EventPartner; tone: "dark" | "light" }) {
  const content = (
    <div
      className={`flex items-center gap-4 border-b px-1 py-4 transition-colors duration-300 last:border-b-0 ${
        tone === "dark" ? "border-gold-soft/15 hover:bg-gold-soft/5" : "border-ink/10 hover:bg-ink/[0.03]"
      }`}
    >
      <PartnerMark partner={partner} tone={tone} />
      <span className={`font-data flex-1 text-sm uppercase tracking-[0.1em] ${tone === "dark" ? "text-ivory" : "text-ink"}`}>
        {partner.name}
      </span>
      {partner.tier ? (
        <span
          className={`font-data shrink-0 border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${
            tone === "dark" ? "border-gold-soft/40 text-gold-soft" : "border-gold/40 text-gold"
          }`}
        >
          {partner.tier}
        </span>
      ) : null}
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

export function PartnersLedger({ partners, tone = "light" }: { partners: EventPartner[]; tone?: "dark" | "light" }) {
  if (partners.length === 0) {
    return (
      <Reveal>
        <LineDraw tone={tone} className="mb-6" />
        <p className={`font-data text-xs uppercase tracking-[0.18em] ${tone === "dark" ? "text-mist" : "text-stone"}`}>
          Parceiros deste encontro em confirmação.
        </p>
      </Reveal>
    );
  }

  return (
    <Reveal className={`border ${tone === "dark" ? "border-gold-soft/25" : "border-ink/15"}`}>
      {partners.map((partner) => (
        <PartnerRow key={partner.id} partner={partner} tone={tone} />
      ))}
    </Reveal>
  );
}
