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
  adminKey?: string;
};

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  let response: Response;

  const headers: Record<string, string> = {};
  if (options.body) headers["Content-Type"] = "application/json";
  if (options.adminKey) headers["Authorization"] = `Bearer ${options.adminKey}`;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: Object.keys(headers).length ? headers : undefined,
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

async function adminUpload<T>(path: string, formData: FormData, adminKey: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminKey}` },
      body: formData,
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

export type ApplicationStatus = "pending" | "under_review" | "approved" | "rejected";

export type WaitlistEntry = WaitlistPayload & {
  id: string;
  status: ApplicationStatus;
  created_at: string;
};

export type MembershipApplication = MembershipPayload & {
  id: string;
  status: ApplicationStatus;
  reviewed_at?: string | null;
  created_at: string;
};

export type SponsorshipApplication = SponsorshipPayload & {
  id: string;
  status: ApplicationStatus;
  created_at: string;
};

export type MeetingBooking = MeetingBookingPayload & {
  id: string;
  slot_id: string;
  created_at: string;
  meeting_slots?: { starts_at: string; ends_at: string; location?: string | null } | null;
};

export type MeetingSlotPayload = {
  starts_at: string;
  ends_at: string;
  location?: string;
  capacity?: number;
};

export type BlogCategoryPayload = {
  name: string;
  slug: string;
};

export type BlogPostPayload = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  category_id?: string;
  author_name?: string;
  status: "draft" | "published";
};

export type EventPayload = {
  title: string;
  slug: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  status: EventStatus;
  cover_image_url?: string;
  max_attendees?: number;
};

export type EventPartnerPayload = {
  name: string;
  logo_url: string;
  website?: string;
  tier?: string;
  display_order?: number;
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

// Endpoints administrativos — todos exigem a ADMIN_API_KEY (ver backend/README.md).
// Usados só pelo painel em /admin, nunca pelas páginas públicas.
export const adminApi = {
  waitlist: {
    list: (adminKey: string) => request<WaitlistEntry[]>("/waitlist", { adminKey, cache: "no-store" }),
    updateStatus: (adminKey: string, id: string, status: ApplicationStatus) =>
      request<WaitlistEntry>(`/waitlist/${id}/status`, { method: "PATCH", body: { status }, adminKey }),
  },
  membership: {
    list: (adminKey: string) =>
      request<MembershipApplication[]>("/membership-applications", { adminKey, cache: "no-store" }),
    get: (adminKey: string, id: string) =>
      request<MembershipApplication>(`/membership-applications/${id}`, { adminKey, cache: "no-store" }),
    updateStatus: (adminKey: string, id: string, status: ApplicationStatus) =>
      request<MembershipApplication>(`/membership-applications/${id}/status`, {
        method: "PATCH",
        body: { status },
        adminKey,
      }),
    remove: (adminKey: string, id: string) =>
      request<void>(`/membership-applications/${id}`, { method: "DELETE", adminKey }),
  },
  sponsorship: {
    list: (adminKey: string) =>
      request<SponsorshipApplication[]>("/sponsorships", { adminKey, cache: "no-store" }),
    updateStatus: (adminKey: string, id: string, status: ApplicationStatus) =>
      request<SponsorshipApplication>(`/sponsorships/${id}/status`, {
        method: "PATCH",
        body: { status },
        adminKey,
      }),
    remove: (adminKey: string, id: string) =>
      request<void>(`/sponsorships/${id}`, { method: "DELETE", adminKey }),
  },
  meetings: {
    listSlotsAdmin: (adminKey: string) =>
      request<MeetingSlot[]>("/meetings/slots/admin", { adminKey, cache: "no-store" }),
    createSlot: (adminKey: string, payload: MeetingSlotPayload) =>
      request<MeetingSlot>("/meetings/slots", { method: "POST", body: payload, adminKey }),
    cancelSlot: (adminKey: string, id: string) =>
      request<MeetingSlot>(`/meetings/slots/${id}`, { method: "DELETE", adminKey }),
    listBookings: (adminKey: string) =>
      request<MeetingBooking[]>("/meetings/bookings", { adminKey, cache: "no-store" }),
  },
  blog: {
    createCategory: (adminKey: string, payload: BlogCategoryPayload) =>
      request<BlogCategory>("/blog/categories", { method: "POST", body: payload, adminKey }),
    listPostsAdmin: (adminKey: string, params?: { status?: string; category?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.category) query.set("category", params.category);
      query.set("pageSize", "50");
      return request<Paginated<BlogPost>>(`/blog/posts/admin?${query.toString()}`, { adminKey, cache: "no-store" });
    },
    createPost: (adminKey: string, payload: BlogPostPayload) =>
      request<BlogPost>("/blog/posts", { method: "POST", body: payload, adminKey }),
    updatePost: (adminKey: string, id: string, payload: Partial<BlogPostPayload>) =>
      request<BlogPost>(`/blog/posts/${id}`, { method: "PATCH", body: payload, adminKey }),
    deletePost: (adminKey: string, id: string) =>
      request<void>(`/blog/posts/${id}`, { method: "DELETE", adminKey }),
  },
  events: {
    create: (adminKey: string, payload: EventPayload) =>
      request<SsgEvent>("/events", { method: "POST", body: payload, adminKey }),
    update: (adminKey: string, id: string, payload: Partial<EventPayload>) =>
      request<SsgEvent>(`/events/${id}`, { method: "PATCH", body: payload, adminKey }),
    remove: (adminKey: string, id: string) => request<void>(`/events/${id}`, { method: "DELETE", adminKey }),
    listPartners: (adminKey: string, eventId: string) =>
      request<EventPartner[]>(`/events/${eventId}/partners`, { adminKey, cache: "no-store" }),
    createPartner: (adminKey: string, eventId: string, payload: EventPartnerPayload) =>
      request<EventPartner>(`/events/${eventId}/partners`, { method: "POST", body: payload, adminKey }),
    updatePartner: (adminKey: string, eventId: string, id: string, payload: Partial<EventPartnerPayload>) =>
      request<EventPartner>(`/events/${eventId}/partners/${id}`, { method: "PATCH", body: payload, adminKey }),
    deletePartner: (adminKey: string, eventId: string, id: string) =>
      request<void>(`/events/${eventId}/partners/${id}`, { method: "DELETE", adminKey }),
  },
  gallery: {
    upload: (adminKey: string, formData: FormData) => adminUpload<GalleryPhoto>("/gallery", formData, adminKey),
    remove: (adminKey: string, id: string) => request<void>(`/gallery/${id}`, { method: "DELETE", adminKey }),
  },
};
