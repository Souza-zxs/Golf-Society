# Sellers Society Golf — API

Backend do site institucional do **Sellers Society Golf**: networking
empresarial via golfe (eventos corporativos, comunidade de
empresários/CEOs/executivos, patrocínio). Foco inicial: região de São Paulo.

Stack: Node.js + TypeScript + Express + Supabase (Postgres + Storage) +
dotenv + cors, seguindo a mesma convenção usada em outros backends do
projeto (ex.: `consultorio-pf-api`).

> Esta rodada cobre **apenas o backend**. Front-end, deploy, domínio e
> credenciais reais ficam para etapas seguintes.

## Como rodar

```bash
npm install
cp .env.example .env   # preencha com as credenciais do seu projeto Supabase
npm run dev             # http://localhost:3333
```

Build de produção:

```bash
npm run build
npm start
```

Checar tipos sem gerar build:

```bash
npm run typecheck
```

## Configuração

Variáveis de ambiente (ver `.env.example`):

| Variável | Descrição |
| --- | --- |
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_KEY` | Service role key (nunca expor no front) |
| `SUPABASE_GALLERY_BUCKET` | Nome do bucket de Storage para fotos da galeria (padrão: `gallery`) |
| `CORS_ORIGIN` | Origens do front-end autorizadas (separadas por vírgula) |
| `PORT` | Porta HTTP (padrão: `3333`) |
| `NODE_ENV` | `development` / `production` |

### Banco de dados

O schema SQL fica em `supabase/migrations/` (`0001_init.sql`,
`0002_event_partners.sql`, aplicados nessa ordem). Aplique no projeto
Supabase via Supabase CLI (`supabase db push`) ou colando o conteúdo de
cada arquivo, em ordem, no SQL Editor do painel. Crie também um bucket de
Storage **público para leitura** chamado `gallery` (ou o nome definido em
`SUPABASE_GALLERY_BUCKET`) para as fotos.

### Autenticação administrativa

Endpoints administrativos (gestão de candidaturas, posts, eventos, horários
e galeria) são protegidos por uma sessão do Supabase Auth (e-mail + senha),
enviada via header:

```
Authorization: Bearer <access_token>
```

O middleware (`src/middleware/requireAdmin.ts`) valida o token chamando
`supabase.auth.getUser(token)` contra o servidor de Auth do Supabase — não
há verificação manual de JWKS/assinatura. Não existe cadastro público nem
tabela de RBAC: qualquer conta existente no Supabase Auth do projeto já
conta como admin, então o cadastro de novos usuários deve ficar desativado
em Authentication → Settings, e as contas devem ser criadas manualmente em
Authentication → Users.

## Endpoints

Todas as respostas de erro seguem um formato inspirado em RFC 7807
(`title`, `status`, `detail`/`errors`).

### Contato / lista de espera (`/waitlist`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/waitlist` | público | Envia interesse (formulário premium tipo convite) |
| GET | `/waitlist` | admin | Lista interessados |
| PATCH | `/waitlist/:id/status` | admin | Atualiza status (`pending`/`under_review`/`approved`/`rejected`) |

### Candidatura a membro (`/membership-applications`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/membership-applications` | público | Envia candidatura ("Seja um Membro") |
| GET | `/membership-applications` | admin | Lista candidaturas |
| GET | `/membership-applications/:id` | admin | Detalha uma candidatura |
| PATCH | `/membership-applications/:id/status` | admin | Aprova/rejeita |

### Candidatura de patrocínio (`/sponsorships`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| POST | `/sponsorships` | público | Envia candidatura ("Seja um Patrocinador") |
| GET | `/sponsorships` | admin | Lista candidaturas |
| PATCH | `/sponsorships/:id/status` | admin | Aprova/rejeita |

### Agendamento de reuniões (`/meetings`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/meetings/slots` | público | Lista somente horários abertos |
| GET | `/meetings/slots/admin` | admin | Lista horários em qualquer status |
| POST | `/meetings/slots` | admin | Cria horário disponível |
| DELETE | `/meetings/slots/:id` | admin | Cancela horário |
| POST | `/meetings/slots/:id/book` | público | Reserva um horário |
| GET | `/meetings/bookings` | admin | Lista reservas |

Modelo inicial pensado para evoluir depois para integração com um
provedor de calendário; por ora é CRUD básico com transição atômica de
status do horário (`open` → `booked`) para evitar reservas duplicadas.

### Blog (`/blog`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/blog/categories` | público | Lista categorias |
| POST | `/blog/categories` | admin | Cria categoria |
| GET | `/blog/posts` | público | Lista posts publicados (paginado, `?category=`) |
| GET | `/blog/posts/admin` | admin | Lista posts em qualquer status (`?status=`, `?category=`) |
| GET | `/blog/posts/:slug` | público | Detalha post pelo slug |
| POST | `/blog/posts` | admin | Cria post |
| PATCH | `/blog/posts/:id` | admin | Atualiza post |
| DELETE | `/blog/posts/:id` | admin | Remove post |

### Eventos (`/events`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/events` | público | Lista eventos (paginado, `?status=`) |
| GET | `/events/:slug` | público | Detalha evento pelo slug — já inclui `partners` (ver abaixo) |
| POST | `/events` | admin | Cria evento |
| PATCH | `/events/:id` | admin | Atualiza evento |
| DELETE | `/events/:id` | admin | Remove evento |

#### Parceiros confirmados do evento (`/events/:eventId/partners`)

Lista curada dos parceiros/patrocinadores **já confirmados** de um evento,
para exibição pública na página do evento — diferente de `/sponsorships`,
que é o pipeline de *candidatura* a patrocínio (ainda não aprovada).

**Decisão de design:** não criamos um `GET /events/:eventId/partners`
público separado. `GET /events/:slug` já retorna os parceiros embutidos no
campo `partners` (mesmo padrão já usado no projeto para dados relacionados:
`blog_posts` embute `blog_categories`, `meeting_bookings` embute
`meeting_slots`). Isso evita uma segunda chamada HTTP no front só para
montar a página do evento. O CRUD abaixo é 100% administrativo.

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/events/:eventId/partners` | admin | Lista todos os parceiros do evento |
| POST | `/events/:eventId/partners` | admin | Cria parceiro confirmado |
| PATCH | `/events/:eventId/partners/:id` | admin | Atualiza parceiro |
| DELETE | `/events/:eventId/partners/:id` | admin | Remove parceiro |

Shape de `partners` dentro de `GET /events/:slug`, ordenado por
`display_order` crescente:

```json
{
  "id": "…",
  "title": "…",
  "slug": "…",
  "partners": [
    {
      "id": "…",
      "event_id": "…",
      "name": "Empresa X",
      "logo_url": "https://…",
      "website": "https://…",
      "tier": "gold",
      "display_order": 0,
      "created_at": "2026-07-29T…"
    }
  ]
}
```

### Galeria de fotos (`/gallery`)

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| GET | `/gallery` | público | Lista fotos (paginado, `?event_id=`) |
| POST | `/gallery` | admin | Upload de foto — `multipart/form-data`, campo `photo` (+ `title`, `event_id` opcionais) |
| DELETE | `/gallery/:id` | admin | Remove foto (registro + arquivo no Storage) |

Upload aceita apenas JPEG/PNG/WebP, limite de 10MB, e o arquivo é salvo no
Supabase Storage com nome gerado no servidor (evita path traversal e
colisão de nomes).

## Páginas institucionais

Home, Sobre, O Conceito, Benefícios para Membros e os links de
Instagram/LinkedIn/WhatsApp são conteúdo estático do front-end — não
exigem endpoint de backend nesta fase.

## Estrutura

```
src/
  config/        # env e client Supabase
  middleware/     # validação (zod), auth admin, rate limit, upload, erros
  schemas/        # schemas zod por recurso
  controllers/    # lógica de acesso a dados (Supabase)
  routes/         # definição das rotas Express por recurso
  types/          # tipos compartilhados
supabase/
  migrations/     # schema SQL
```
