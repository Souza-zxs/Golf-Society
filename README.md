# Golf Society (Sellers Society Golf)

Monorepo do projeto Sellers Society Golf: networking empresarial via golfe
(eventos corporativos, comunidade de empresários/CEOs/executivos,
patrocínio). Ver `backend/README.md` e `frontend/README.md` para detalhes
de cada parte.

## Estrutura

- `backend/` — API REST (Node.js + TypeScript + Express + Supabase).
- `frontend/` — Site institucional (Next.js), consumindo a API do backend.

## Como rodar

```bash
# backend
cd backend
npm install
cp .env.example .env   # preencha com credenciais do seu projeto Supabase
npm run dev             # http://localhost:3333

# frontend (em outro terminal)
cd frontend
npm install
npm run dev
```
