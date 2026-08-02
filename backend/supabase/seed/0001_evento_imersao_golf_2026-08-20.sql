-- Seed: evento "Imersão & Experiência de Golf" (20/08/2026)
-- Fonte: material de convite "CONVIDADOS - SELLERS SOCIETY GOLF.pdf".
-- Aplique depois das migrations (0001_init.sql, 0002_event_partners.sql),
-- colando no SQL Editor do Supabase, ou via `supabase db push` se este
-- arquivo for movido para supabase/migrations/. Local/endereço ainda não
-- definidos — atualize `location`/`address` quando o campo for confirmado.

insert into events (
  title,
  slug,
  description,
  event_date,
  start_time,
  end_time,
  status
) values (
  'Imersão & Experiência de Golf',
  'imersao-experiencia-golf-2026-08-20',
  'Aprenda os fundamentos do golfe executivo com o Professor Robson Gomes, instrutor de golfe de Pablo Marçal. Muito além da técnica: uma experiência de etiqueta, estratégia e relacionamento em um dos ambientes mais tradicionais do mundo dos negócios. Check-in às 7h30, atividades das 9h às 12h (Driving Range, Putting Green e torneio final com premiação para os três primeiros colocados). Café da manhã incluso. Ingresso Experience: R$ 497 (café da manhã, experiência completa, Driving Range, Putting Green, professores especializados, equipamentos completos e networking exclusivo). Ingresso Founder: R$ 797 (tudo isso mais almoço e broche exclusivo de Membro Fundador).',
  '2026-08-20',
  '07:30',
  '12:00',
  'upcoming'
);
