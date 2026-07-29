import Link from "next/link";
import { SsgEvent } from "@/lib/api";
import { EVENT_STATUS_LABEL, formatEventDay, formatEventMonth } from "@/lib/format";

export function EventCard({ event }: { event: SsgEvent }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex gap-6 border-b border-ink/10 py-8 first:pt-0 last:border-b-0"
    >
      <div className="flex w-16 shrink-0 flex-col items-center border border-ink/15 py-3">
        <span className="font-display text-2xl leading-none text-ink">{formatEventDay(event.event_date)}</span>
        <span className="font-data mt-1 text-[10px] tracking-[0.2em] text-gold">
          {formatEventMonth(event.event_date)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <span className="font-data text-[10px] uppercase tracking-[0.2em] text-stone">
          {EVENT_STATUS_LABEL[event.status]}
          {event.location ? ` · ${event.location}` : ""}
        </span>
        <h3 className="font-display text-2xl text-ink transition-colors group-hover:text-gold">
          {event.title}
        </h3>
        {event.description ? (
          <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-stone">{event.description}</p>
        ) : null}
        <span className="font-data mt-1 text-[11px] uppercase tracking-[0.18em] text-ink underline decoration-gold/50 underline-offset-4">
          Ver detalhes
        </span>
      </div>
    </Link>
  );
}
