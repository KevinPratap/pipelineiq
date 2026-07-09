# Changelog

## 1.0.0 (2026-07-09)

### Features

- Kanban pipeline board with drag-and-drop (dnd-kit)
- Deal CRUD with inline edit on detail page
- Activity timeline (calls, emails, notes, meetings, tasks)
- Dashboard with metrics (pipeline value, weighted forecast, win rate)
- Analytics with stage conversion tracking
- Deal detail view with activity logging
- CSV export
- Dark/light mode
- Mobile responsive layout
- Credentials authentication (NextAuth v5)
- Database seeding with demo data

### Technical

- Next.js 16 App Router, TypeScript strict
- Prisma 7 + PostgreSQL (via PrismaPg adapter)
- Tailwind CSS v4 with shadcn/ui primitives
- Auto-migration on startup (prisma db push)
- GitHub Actions CI
- SEO: sitemap.xml, robots.txt, manifest.json
