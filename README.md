# Chawni Architectures

Website for **Chawni Architectures** (চাউনি — স্থাপত্য প্রকৌশল), an architecture, engineering,
interior and construction company. Tagline: _For an environment to live._

Bilingual (English / বাংলা), content-driven, with three lazy-loaded 3D scenes.
All current content is **dummy data** — see [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md).

## Stack

Next.js (App Router, RSC) · TypeScript strict · Tailwind CSS v4 · next-intl · Radix UI ·
Framer Motion · GSAP + ScrollTrigger · Lenis · three.js / react-three-fiber / drei ·
React Hook Form + Zod · Resend · Vitest · Playwright + axe · ESLint · Prettier · commitlint · Husky.

## Setup

```bash
nvm use            # Node 20+ (.nvmrc)
pnpm install
cp .env.example .env.local
pnpm dev           # http://localhost:3000  (redirects to /en)
```

## Scripts

| Script           | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Dev server                                        |
| `pnpm build`     | Production build                                  |
| `pnpm start`     | Serve the production build                        |
| `pnpm lint`      | ESLint (next, typescript, jsx-a11y)               |
| `pnpm typecheck` | `next typegen` + `tsc --noEmit`                   |
| `pnpm test`      | Vitest unit tests                                 |
| `pnpm test:e2e`  | Playwright smoke + axe (needs `pnpm build` first) |
| `pnpm analyze`   | Bundle analyzer (webpack build)                   |
| `pnpm format`    | Prettier                                          |

## Structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). In short: `src/app/[locale]` routes,
`src/components/{ui,layout,sections,three,forms}`, `src/content` (typed dummy data),
`content/journal` (MDX), `messages/` (translations), `tests/{unit,e2e}`.

## Deploy

Target is Vercel: import the repo, set the variables from `.env.example`, deploy. No `vercel.json` is needed.

## Docs

[Project plan](docs/PROJECT_PLAN.md) · [Architecture](docs/ARCHITECTURE.md) ·
[Content guide](docs/CONTENT_GUIDE.md) · [Brand](docs/BRAND.md) · [Decisions](docs/DECISIONS.md) ·
[Handover](docs/HANDOVER.md) · [Contributing](CONTRIBUTING.md)
