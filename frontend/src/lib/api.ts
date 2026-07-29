const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  cache?: RequestCache;
  next?: { revalidate?: number };
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next: options.next,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor.", 0);
  }

  if (!response.ok) {
    let title = "Não foi possível concluir a solicitação.";
    let detail: string | undefined;

    try {
      const problem = await response.json();
      title = problem?.title ?? title;
      detail = problem?.detail ?? problem?.errors?.[0]?.message;
    } catch {
      // resposta de erro sem corpo JSON: mantém a mensagem genérica
    }

    throw new ApiError(title, response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category_id?: string | null;
  author_name?: string | null;
  status: "draft" | "published";
  published_at?: string | null;
  created_at: string;
  blog_categories?: BlogCategory | null;
};

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type EventPartner = {
  id: string;
  event_id: string;
  name: string;
  logo_url?: string | null;
  website?: string | null;
  tier?: string | null;
  display_order: number;
  created_at: string;
};

export type SsgEvent = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  event_date: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  address?: string | null;
  status: EventStatus;
  cover_image_url?: string | null;
  max_attendees?: number | null;
  partners?: EventPartner[];
};

export type GalleryPhoto = {
  id: string;
  title?: string | null;
  event_id?: string | null;
  image_url: string;
  uploaded_at: string;
};

export type MeetingSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
  location?: string | null;
  capacity: number;
  status: "open" | "booked" | "cancelled";
};

export type WaitlistPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  city?: string;
  referred_by?: string;
  message?: string;
};

export type MembershipPayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  linkedin_url?: string;
  city?: string;
  motivation: string;
};

export type SponsorshipPayload = {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  sponsorship_tier?: string;
  message?: string;
};

export type MeetingBookingPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
};

export const api = {
  waitlist: {
    create: (payload: WaitlistPayload) => request<{ id: string }>("/waitlist", { method: "POST", body: payload }),
  },
  membership: {
    create: (payload: MembershipPayload) =>
      request<{ id: string }>("/membership-applications", { method: "POST", body: payload }),
  },
  sponsorship: {
    create: (payload: SponsorshipPayload) =>
      request<{ id: string }>("/sponsorships", { method: "POST", body: payload }),
  },
  meetings: {
    listSlots: () => request<MeetingSlot[]>("/meetings/slots", { cache: "no-store" }),
    book: (slotId: string, payload: MeetingBookingPayload) =>
      request<{ id: string }>(`/meetings/slots/${slotId}/book`, { method: "POST", body: payload }),
  },
  blog: {
    listCategories: () => request<BlogCategory[]>("/blog/categories", { next: { revalidate: 300 } }),
    listPosts: (params?: { category?: string; page?: number; pageSize?: number }) => {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.page) query.set("page", String(params.page));
      if (params?.pageSize) query.set("pageSize", String(params.pageSize));
      const qs = query.toString();
      return request<Paginated<BlogPost>>(`/blog/posts${qs ? `?${qs}` : ""}`, { next: { revalidate: 120 } });
    },
    getBySlug: (slug: string) => request<BlogPost>(`/blog/posts/${slug}`, { next: { revalidate: 120 } }),
  },
  events: {
    list: (params?: { status?: EventStatus; page?: number; pageSize?: number }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.page) query.set("page", String(params.page));
      if (params?.pageSize) query.set("pageSize", String(params.pageSize));
      const qs = query.toString();
      return request<Paginated<SsgEvent>>(`/events${qs ? `?${qs}` : ""}`, { next: { revalidate: 120 } });
    },
    getBySlug: (slug: string) => request<SsgEvent>(`/events/${slug}`, { next: { revalidate: 120 } }),
  },
  gallery: {
    list: (params?: { event_id?: string; page?: number; pageSize?: number }) => {
      const query = new URLSearchParams();
      if (params?.event_id) query.set("event_id", params.event_id);
      if (params?.page) query.set("page", String(params.page));
      if (params?.pageSize) query.set("pageSize", String(params.pageSize));
      const qs = query.toString();
      return request<Paginated<GalleryPhoto>>(`/gallery${qs ? `?${qs}` : ""}`, { next: { revalidate: 300 } });
    },
  },
};
