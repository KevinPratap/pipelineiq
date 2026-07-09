# PipelineIQ

Kanban CRM for B2B sales teams. Built for the Digital Heroes trial task.

Built with Next.js 16, TypeScript, Prisma 7 (PostgreSQL), Auth.js v5, Tailwind CSS v4, shadcn/ui, and dnd-kit.

**Live demo:** https://web-production-4f2d8.up.railway.app

## Quick start

```bash
git clone https://github.com/KevinPratap/pipelineiq
cd pipelineiq
npm install
cp .env.example .env
# Set DATABASE_URL to your Postgres connection string
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```

## Railway setup

1. Create a Railway project with PostgreSQL + web service from GitHub
2. Set `AUTH_SECRET` env var on the web service
3. In the **Railway dashboard**, go to the web service **Variables** tab and set:
   - `DATABASE_URL` = `${Postgres.DATABASE_PUBLIC_URL}` (Railway reference — resolves at runtime)
4. Deploy will auto-build
5. Once deployed, visit `https://<your-url>/api/seed` (POST) to populate demo data
6. Login with `demo@pipelineiq.dev` / `demo1234`

## Features

- Visual Kanban pipeline with drag-and-drop (dnd-kit)
- Deal detail view with activity timeline
- Dashboard with metrics + stage chart
- Analytics with conversion tracking
- Dark/light mode
- Auth via credentials (NextAuth v5)

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL via Prisma 7 |
| Auth | NextAuth v5 (Credentials) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Drag & drop | dnd-kit |
| Charts | Recharts |
| Deployment | Railway |

## Project structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected pages (dashboard, pipeline, analytics, settings)
│   ├── api/             # API routes (auth, seed)
│   ├── sign-in/         # Login page
│   ├── sign-up/         # Registration page
│   └── page.tsx         # Landing page
├── components/
│   ├── dashboard/       # Metrics cards, pipeline chart
│   ├── layout/          # Sidebar, topbar
│   ├── pipeline/        # Kanban board, column, deal card, create form
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── actions/         # Server actions (deals, activities, auth)
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Prisma client singleton
│   └── utils.ts         # cn() helper
└── types/               # Shared TypeScript types
```
