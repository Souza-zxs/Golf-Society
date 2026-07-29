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
| `ADMIN_API_KEY` | Chave usada pelos endpoints administrativos |
| `CORS_ORIGIN` | Origens do front-end autorizadas (separadas por vírgula) |
| `PORT` | Porta HTTP (padrão: `3333`) |
| `NODE_ENV` | `development` / `production` |

### Banco de dados

O schema SQL fica em `supabase/migrations/0001_init.sql`. Aplique no
projeto Supabase via Supabase CLI (`supabase db push`) ou colando o
conteúdo no SQL Editor do painel. Crie também um bucket de Storage
**público para leitura** chamado `gallery` (ou o nome definido em
`SUPABASE_GALLERY_BUCKET`) para as fotos.

### Autenticação administrativa

Não há sistema de contas de usuário nesta etapa. Endpoints administrativos
(gestão de candidaturas, posts, eventos, horários e galeria) são
protegidos por uma chave simples enviada via header:

```
Authorization: Bearer <ADMIN_API_KEY>
```

Isso é suficiente para uso interno (painel administrativo futuro ou
Postman) sem exigir infraestrutura de autenticação completa nesta fase.
Quando houver um painel administrativo com múltiplos usuários, este
mecanismo deve evoluir para Supabase Auth com RBAC.

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
| GET | `/meetings/slots` | público | Lista horários abertos (`?status=all` para admin ver todos) |
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
| GET | `/events/:slug` | público | Detalha evento pelo slug |
| POST | `/events` | admin | Cria evento |
| PATCH | `/events/:id` | admin | Atualiza evento |
| DELETE | `/events/:id` | admin | Remove evento |

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
