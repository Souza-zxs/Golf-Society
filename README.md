# Sellers Society Golf — Front-end

Site institucional do **Sellers Society Golf**: networking empresarial via
golfe (eventos corporativos, comunidade de empresários/CEOs/executivos,
patrocínio). Foco inicial: São Paulo.

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.

## Como rodar

```bash
npm install
cp .env.example .env.local   # aponta para a API local (ver abaixo)
npm run dev                   # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Backend

Este front-end consome a API do **Sellers Society Golf** (backend em
`D:\Projetos\Golf Society`, Node.js + Express + Supabase). Configure a URL
via variável de ambiente:

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base da API (padrão: `http://localhost:3333`) |

Rode a API localmente (`npm run dev` no repo do backend, porta `3333`) antes
de usar formulários, eventos, blog, galeria e agendamento aqui no front.
Endpoints administrativos (protegidos por `ADMIN_API_KEY`) não são usados
por este front — apenas as rotas públicas documentadas no README do
backend.

## Páginas

| Rota | Conteúdo | Integração com API |
| --- | --- | --- |
| `/` | Home | Próximos eventos, últimos posts do blog |
| `/o-conceito` | O Conceito | Estático |
| `/sobre` | Sobre a Sellers Society Golf | Estático |
| `/beneficios` | Benefícios para Membros | Estático |
| `/eventos`, `/eventos/[slug]` | Agenda de eventos | `GET /events`, `GET /events/:slug`, `GET /gallery?event_id=` |
| `/patrocinadores` | Modalidades de patrocínio | Estático |
| `/galeria` | Galeria de fotos | `GET /gallery` |
| `/blog`, `/blog/[slug]` | Conteúdo/blog | `GET /blog/posts`, `GET /blog/posts/:slug` |
| `/seja-membro` | Candidatura a membro | `POST /membership-applications` |
| `/seja-patrocinador` | Candidatura de patrocínio | `POST /sponsorships` |
| `/contato` | Lista de espera + agendamento de conversa | `POST /waitlist`, `GET /meetings/slots`, `POST /meetings/slots/:id/book` |

Instagram, LinkedIn e WhatsApp são links diretos no cabeçalho/rodapé — sem
integração de API.

## Estrutura

```
src/
  app/            # rotas (App Router)
  components/
    ui/           # primitivos (botão, container, ledger card, etc.)
    layout/       # header, footer, logo, botão de WhatsApp
    forms/        # formulários com integração à API
    content/      # cards de evento/post, estado vazio
  lib/
    api.ts        # client HTTP tipado para a API do backend
    format.ts      # formatação de datas
    nav.ts         # links de navegação e redes sociais
```

## Design

Identidade visual sofisticada e minimalista inspirada em clubes privados de
golfe: preto/verde profundo com dourado como acento, tipografia serifada
(Fraunces) para títulos e grotesca (Manrope) para texto, com uma mono
(IBM Plex Mono) usada em rótulos e dados — remetendo a scorecards e
cartões de sócio. O elemento assinatura recorrente é o "cartão de sócio"
(`LedgerCard`), usado no hero, em benefícios e no agendamento.
