export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface WaitlistEntry {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  city?: string;
  referred_by?: string;
  message?: string;
  status?: ApplicationStatus;
  created_at?: string;
}

export interface MembershipApplication {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  linkedin_url?: string;
  city?: string;
  motivation: string;
  status?: ApplicationStatus;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface SponsorshipApplication {
  id?: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  sponsorship_tier?: string;
  message?: string;
  status?: ApplicationStatus;
  created_at?: string;
}

export type MeetingSlotStatus = 'open' | 'booked' | 'cancelled';

export interface MeetingSlot {
  id?: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  capacity?: number;
  status?: MeetingSlotStatus;
  created_at?: string;
}

export interface MeetingBooking {
  id?: string;
  slot_id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  created_at?: string;
}

export interface BlogCategory {
  id?: string;
  name: string;
  slug: string;
  created_at?: string;
}

export type PostStatus = 'draft' | 'published';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  category_id?: string | null;
  author_name?: string;
  status?: PostStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface GolfEvent {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  status?: EventStatus;
  cover_image_url?: string;
  max_attendees?: number;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryPhoto {
  id?: string;
  event_id?: string | null;
  title?: string;
  image_url: string;
  storage_path: string;
  uploaded_at?: string;
}
