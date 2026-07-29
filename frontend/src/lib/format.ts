const eventDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatEventDate(isoDate: string) {
  return eventDateFormatter.format(new Date(`${isoDate}T00:00:00`));
}

export function formatEventDay(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).getDate().toString().padStart(2, "0");
}

export function formatEventMonth(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

const publishedFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatPublishedDate(iso: string) {
  return publishedFormatter.format(new Date(iso));
}

export const EVENT_STATUS_LABEL: Record<string, string> = {
  upcoming: "Em breve",
  ongoing: "Em andamento",
  completed: "Realizado",
  cancelled: "Cancelado",
};
