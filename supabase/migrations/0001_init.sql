-- Sellers Society Golf — schema inicial
-- Convenção: uuid como PK, timestamps em UTC, RLS habilitado em todas as
-- tabelas (o backend acessa via service role key, que ignora RLS; as
-- policies aqui existem para o dia em que o front consumir Supabase
-- diretamente com anon key, ou para outras ferramentas administrativas).

create extension if not exists "pgcrypto";

create type application_status as enum ('pending', 'under_review', 'approved', 'rejected');
create type meeting_slot_status as enum ('open', 'booked', 'cancelled');
create type post_status as enum ('draft', 'published');
create type event_status as enum ('upcoming', 'ongoing', 'completed', 'cancelled');

-- Contato / lista de espera (formulário premium tipo convite)
create table waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text,
  role text,
  city text,
  referred_by text,
  message text,
  status application_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index waitlist_entries_status_idx on waitlist_entries (status);
create index waitlist_entries_created_at_idx on waitlist_entries (created_at desc);

-- Candidatura a membro ("Seja um Membro")
create table membership_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  company text not null,
  role text not null,
  linkedin_url text,
  city text,
  motivation text not null,
  status application_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index membership_applications_status_idx on membership_applications (status);
create index membership_applications_created_at_idx on membership_applications (created_at desc);

-- Candidatura a patrocinador ("Seja um Patrocinador")
create table sponsorship_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  website text,
  sponsorship_tier text,
  message text,
  status application_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index sponsorship_applications_status_idx on sponsorship_applications (status);

-- Agendamento de reuniões: horários disponíveis + reservas
create table meeting_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  capacity int not null default 1,
  status meeting_slot_status not null default 'open',
  created_at timestamptz not null default now(),
  constraint meeting_slots_time_order check (ends_at > starts_at)
);

create index meeting_slots_status_starts_at_idx on meeting_slots (status, starts_at);

create table meeting_bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references meeting_slots (id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  company text,
  notes text,
  created_at timestamptz not null default now()
);

create index meeting_bookings_slot_id_idx on meeting_bookings (slot_id);

-- Blog
create table blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  category_id uuid references blog_categories (id) on delete set null,
  author_name text,
  status post_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_published_at_idx on blog_posts (status, published_at desc);
create index blog_posts_category_id_idx on blog_posts (category_id);

-- Eventos
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  location text,
  address text,
  status event_status not null default 'upcoming',
  cover_image_url text,
  max_attendees int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_status_event_date_idx on events (status, event_date);

-- Galeria de fotos (arquivos ficam no Supabase Storage, bucket "gallery")
create table gallery_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events (id) on delete set null,
  title text,
  image_url text not null,
  storage_path text not null,
  uploaded_at timestamptz not null default now()
);

create index gallery_photos_event_id_idx on gallery_photos (event_id);

-- Row Level Security: bloqueado por padrão. O backend usa a service role
-- key (que ignora RLS). As policies abaixo liberam apenas leitura pública
-- do conteúdo já pensado para ser público (eventos, posts publicados,
-- categorias, galeria); formulários e dados administrativos permanecem
-- acessíveis somente via service role.
alter table waitlist_entries enable row level security;
alter table membership_applications enable row level security;
alter table sponsorship_applications enable row level security;
alter table meeting_slots enable row level security;
alter table meeting_bookings enable row level security;
alter table blog_categories enable row level security;
alter table blog_posts enable row level security;
alter table events enable row level security;
alter table gallery_photos enable row level security;

create policy "Categorias de blog são públicas para leitura"
  on blog_categories for select
  using (true);

create policy "Posts publicados são públicos para leitura"
  on blog_posts for select
  using (status = 'published');

create policy "Eventos são públicos para leitura"
  on events for select
  using (true);

create policy "Fotos da galeria são públicas para leitura"
  on gallery_photos for select
  using (true);

create policy "Horários abertos são públicos para leitura"
  on meeting_slots for select
  using (status = 'open');
