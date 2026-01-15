# Claro TV+ Live — 100% FlixPatrol (sem JustWatch)

## O que entrega
- Home com 6 streamings em grade 3x2 (cards limpos)
- Ao clicar em um streaming:
  - Top 3 Filmes da Semana (últimos 7 dias, agregando TOP10 diário)
  - Top 3 Séries da Semana (últimos 7 dias, agregando TOP10 diário)
  - Top 3 Filmes do Mês (últimos 30 dias, agregando TOP10 diário)
  - Top 3 Séries do Mês (últimos 30 dias, agregando TOP10 diário)
- Para cada título:
  - Sinopse, gêneros, poster e trailer (YouTube) via TMDB

## Variáveis (obrigatórias)
Crie `.env.local` (use `.env.local.example`):
- `FLIXPATROL_API_KEY`
- `TMDB_TOKEN`
- `CRON_SECRET`

## Rodar local
```bash
npm install
npm run dev
```
Abra: http://localhost:3000

## Produção (Vercel — recomendado)
1) Suba o projeto para a Vercel (GitHub ou upload)  
2) Crie um **Vercel KV** e conecte ao projeto (Storage → KV)  
3) Configure Environment Variables:
   - FLIXPATROL_API_KEY
   - TMDB_TOKEN
   - CRON_SECRET
   - KV_* (a Vercel injeta quando você conecta o KV)

## Atualizar dados (cron)
- O projeto já tem `vercel.json` com cron diário.
- Você também pode disparar manualmente:
`/api/cron/refresh?secret=SEU_CRON_SECRET`

## Globoplay
Se o FlixPatrol tiver Globoplay como company, ele será descoberto automaticamente via `/v2/companies`.
Se o seu plano não permitir listar companies, force o company id no `.env.local`:
`FLIX_COMPANY_ID_GLOBOPLAY=cmp_...`
