import Link from "next/link";
import { SsgEvent } from "@/lib/api";
import { EVENT_STATUS_LABEL, formatEventDay, formatEventMonth } from "@/lib/format";

export function EventCard({ event }: { event: SsgEvent }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex gap-6 border-b border-ink/10 py-8 transition-transform duration-300 ease-out first:pt-0 last:border-b-0 motion-safe:hover:-translate-y-0.5"
    >
      <div className="flex w-16 shrink-0 flex-col items-center border border-ink/15 py-3 transition-colors duration-300 group-hover:border-gold/50">
        <span className="font-display text-2xl leading-none text-ink">{formatEventDay(event.event_date)}</span>
        <span className="font-data mt-1 text-[10px] tracking-[0.2em] text-gold">
          {formatEventMonth(event.event_date)}
        </span>
      </div>

      <div className="hidden aspect-4/3 w-28 shrink-0 overflow-hidden border border-ink/10 bg-ivory-2 transition-colors duration-300 group-hover:border-gold/40 sm:block">
        {event.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_image_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-2xl italic text-stone/40">SSG</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <span className="font-data text-[10px] uppercase tracking-[0.2em] text-stone">
          {EVENT_STATUS_LABEL[event.status]}
          {event.location ? ` · ${event.location}` : ""}
        </span>
        <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-gold">
          {event.title}
        </h3>
        {event.description ? (
          <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-stone">{event.description}</p>
        ) : null}
        <span className="font-data mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink">
          Ver detalhes
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
