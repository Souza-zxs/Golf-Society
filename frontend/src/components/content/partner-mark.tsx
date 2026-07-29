import { EventPartner } from "@/lib/api";

export function PartnerMark({ partner, tone = "light" }: { partner: EventPartner; tone?: "dark" | "light" }) {
  const border = tone === "dark" ? "border-gold-soft/25" : "border-ink/15";

  if (partner.logo_url) {
    return (
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center border bg-white/90 p-1.5 ${border}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={partner.logo_url} alt="" className="h-full w-full object-contain" />
      </span>
    );
  }

  return (
    <span
      className={`font-display flex h-11 w-11 shrink-0 items-center justify-center border text-lg italic ${border} ${
        tone === "dark" ? "text-gold-soft" : "text-gold"
      }`}
      aria-hidden
    >
      {partner.name.charAt(0).toUpperCase()}
    </span>
  );
}
