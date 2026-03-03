# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Pertamina CCTV AI — PPE Detection Frontend**

A React dashboard for monitoring CCTV cameras that detect Personal Protective Equipment (PPE) violations in industrial zones. The frontend is currently decoupled from the ML backend and runs entirely on mock data.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check (tsc) then bundle
npm run lint      # ESLint
npm run preview   # Preview the production build
```

No test runner is configured yet.

## Architecture

### Data Flow

```
src/types/index.ts        ← All shared TypeScript types
src/data/mockData.ts      ← Static mock datasets
src/services/api.ts       ← API layer (mock or real fetch)
src/pages/*.tsx           ← Pages call api.ts functions
src/components/*.tsx      ← Reusable UI primitives
```

### Backend Toggle

`src/services/api.ts` has a `USE_MOCK` flag at the top:

```ts
const USE_MOCK = true;  // flip to false when FastAPI backend is ready
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
```

Set `VITE_API_BASE_URL` in a `.env` file and set `USE_MOCK = false` to switch to the real backend. Auth token is stored in `sessionStorage` under the key `ppeauth_token`. Mock credentials: `admin` / `admin123`.

### Routing (`src/App.tsx`)

`/login` is outside `MainLayout`. All other routes (`/dashboard`, `/live-feed`, `/detections`, `/reports`, `/about`) are wrapped in `MainLayout`, which renders `<Sidebar>` + `<Outlet>`.

### Key Domain Types (`src/types/index.ts`)

- `Camera` — camera metadata, status (`online | offline | alert`), fps, resolution
- `Detection` — PPE inspection event with `missingItems: PPEItem[]`, severity, confidence
- `Alert` — triggered from a Detection, has `acknowledged` flag
- `DashboardStats`, `Zone`, `ReportSummary` — aggregated stats for the dashboard and reports pages

### Planned Backend API Shape (documented in `src/services/api.ts`)

| Method | Endpoint | Returns |
|--------|----------|---------|
| POST | `/auth/login` | `{ token }` |
| GET | `/dashboard/stats` | `DashboardStats` |
| GET | `/zones` | `Zone[]` |
| GET | `/cameras` | `Camera[]` |
| GET | `/cameras/:id` | `Camera` |
| GET | `/detections?limit=` | `Detection[]` |
| GET | `/alerts` | `Alert[]` |
| POST | `/alerts/:id/acknowledge` | — |
| GET | `/reports/summary?period=` | `ReportSummary` |

## Tech Stack

- **React 19** + **TypeScript 5.9**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed)
- **React Router DOM v7**
- **Vite 7**
