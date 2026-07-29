-- Parceiros/patrocinadores confirmados exibidos publicamente em cada evento.
-- Diferente de sponsorship_applications (pipeline de candidatura), esta
-- tabela é a lista curada de parceiros já aprovados, mantida pelo admin.

create table event_partners (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  name text not null,
  logo_url text not null,
  website text,
  tier text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index event_partners_event_id_display_order_idx on event_partners (event_id, display_order);

-- Mesmo padrão de events/gallery_photos: parceiros confirmados são
-- informação pública por natureza.
alter table event_partners enable row level security;

create policy "Parceiros de evento são públicos para leitura"
  on event_partners for select
  using (true);
