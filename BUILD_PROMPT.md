# BUILD PROMPT — Chawni Architectures website

You are building the production website for **Chawni Architectures** (চাউনি — স্থাপত্য প্রকৌশল), an architecture, engineering, interior and construction company. Work through **every phase below, in order, without stopping to ask questions**. Where something is unclear, choose the most standard, professional option, write the decision in `docs/DECISIONS.md`, and keep going.

Real photos and company details will be supplied later. For now use the **dummy data** described in Phase 3. Every dummy value must live in one place (`src/content/`) so it can be replaced without touching components.

---

## 0. Ground rules

- **Package manager:** pnpm. **Node:** 20 LTS or newer. Add `.nvmrc` and `"packageManager"` in package.json.
- **Language:** TypeScript in strict mode. No `any` unless commented with a reason.
- **Quality:** the project must pass `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` at the end of every phase before that phase is committed.
- **No secrets** in the repo. Use `.env.local` (git-ignored) and document every variable in `.env.example`.
- **Accessibility:** WCAG 2.2 AA. Real `<button>`/`<a>`, labels on inputs, visible focus states, alt text, 4.5:1 text contrast, 44px touch targets, `prefers-reduced-motion` respected everywhere.
- **Performance budget:** Lighthouse ≥ 90 for Performance, Accessibility, Best Practices and SEO on mobile for Home, Projects and Contact. Initial JS for pages without 3D < 200 KB gzipped. 3D code is always lazy-loaded.
- **Brand files:** the folder `brand/` next to this prompt contains the vector logo set. Copy it to `public/brand/` in Phase 1 and never redraw or alter the logo.

---

## 1. Git workflow (keep history clean)

1. `git init -b main`. The first commit holds only tooling and config: `chore: initial project scaffold`.
2. Use **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `perf:`, `ci:`) enforced by **commitlint** + **Husky** (`commit-msg` hook). Run **lint-staged** in the `pre-commit` hook (ESLint + Prettier on staged files).
3. Do each phase on its own branch named after it (`feat/design-system`, `feat/home-page`, …). When the phase passes all checks, merge it into `main` with `git merge --no-ff` and a clear merge message, then delete the branch.
4. Inside a branch, make **small, logical commits**, one concern each, never "wip" or "update". Example: `feat(home): add who-we-are section with stats`.
5. Tag the end result `v0.1.0` and generate `CHANGELOG.md` from the commit history.
6. `.gitignore` must cover node_modules, .next, coverage, playwright reports, .env*, .DS_Store, and .vercel.
7. Do **not** push anywhere. No remote is configured yet.

---

## 2. Tech stack

| Area           | Choice                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | Next.js (latest stable, App Router, React Server Components)                                                                                                                                                               |
| Styling        | Tailwind CSS v4 with design tokens as CSS variables; `clsx` + `tailwind-merge`                                                                                                                                             |
| UI primitives  | Radix UI where needed (dialog, navigation menu); shadcn/ui-style local components                                                                                                                                          |
| i18n           | `next-intl`, locales `en` (default) and `bn`, routes `/en/...` and `/bn/...`                                                                                                                                               |
| Content        | Typed TypeScript content files in `src/content/` + MDX journal posts in `content/journal/*.mdx` (`next-mdx-remote/rsc` + `gray-matter`). Write a `ContentSource` interface so a headless CMS (Sanity) can replace it later |
| Animation      | Framer Motion (UI), GSAP + ScrollTrigger (scroll scenes), Lenis (smooth scroll)                                                                                                                                            |
| 3D             | three, @react-three/fiber, @react-three/drei, loaded with `next/dynamic` (`ssr: false`)                                                                                                                                    |
| Forms          | React Hook Form + Zod + a Server Action. Email via Resend if `RESEND_API_KEY` is set, otherwise log to the console in development                                                                                          |
| Icons          | lucide-react (stroke icons only, no emoji)                                                                                                                                                                                 |
| Testing        | Vitest + Testing Library (unit), Playwright (smoke + accessibility with @axe-core/playwright)                                                                                                                              |
| Quality        | ESLint (next + typescript + jsx-a11y), Prettier (+ tailwind plugin), commitlint, Husky, lint-staged                                                                                                                        |
| CI             | GitHub Actions: install → lint → typecheck → test → build → Playwright smoke                                                                                                                                               |
| Hosting target | Vercel (add `vercel.json` only if needed)                                                                                                                                                                                  |

---

## 3. Phases

### Phase 1: Scaffold and tooling (`main`, first commit)

- Create the Next.js app with TypeScript, ESLint, Tailwind, App Router, `src/` dir and the `@/*` import alias.
- Add every tool from the stack table, the Git hooks and the CI workflow `.github/workflows/ci.yml`.
- Copy `brand/` → `public/brand/`. Set the favicon, apple-touch-icon and manifest from those files.
- Scripts: `dev`, `build`, `start`, `lint`, `lint:fix`, `format`, `typecheck`, `test`, `test:e2e`, `analyze`.

### Phase 2: Docs and project plan (`docs/project-plan`)

Create:

- `README.md`: what the project is, stack, setup, scripts, folder structure, how to deploy.
- `docs/PROJECT_PLAN.md`: goals, audience, sitemap, page-by-page section list, content model, phases with milestones and acceptance criteria, risks, and a **"Content needed from Chawni"** checklist (photos per project, team photos and bios, real stats, licences, client logos, testimonials, office address, phone, email, social links, Bangla copy review).
- `docs/ARCHITECTURE.md`: folder structure, rendering strategy, content layer, i18n, 3D loading strategy, performance approach.
- `docs/CONTENT_GUIDE.md`: step-by-step for replacing dummy data and photos (file locations, image sizes, naming, alt text rules).
- `docs/BRAND.md`: logo usage rules (see Section 4), colours, type, spacing, buttons.
- `docs/DECISIONS.md`: a running log of decisions.
- `CONTRIBUTING.md` (branching, commits, PR checklist) and `.env.example`.

### Phase 3: Design system and dummy content (`feat/design-system`)

- Tokens in `src/styles/tokens.css` (Section 4) mapped into Tailwind's theme.
- Fonts via `next/font/google`: **Sora** (headings), **Inter** (body), **Hind Siliguri** (Bangla). In `bn`, switch the body and heading font to Hind Siliguri.
- Components in `src/components/ui/`: `Button` (primary orange / dark / outline, pill shape), `SectionLabel` (lowercase text with orange square, e.g. "who we are"), `Container`, `Heading`, `Stat`, `Chip`, `Card`, `PlaceholderImage`, `Logo` (picks the dark or light SVG from a `variant` or `onDark` prop), `LanguageSwitcher`, `Breadcrumbs`.
- `PlaceholderImage`: a neutral blue-grey block with a small uppercase caption (e.g. "PHOTO · HOUSE EXTERIOR") and the correct aspect ratio. It wraps `next/image` so swapping in a real `src` later needs no layout change.
- **Dummy data** in `src/content/` (typed, each file starts with `// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)`):
  - `company.ts`: name, tagline "For an environment to live.", Bangla tagline, placeholder address, phone, email and WhatsApp number, social links, trade licence and IEB/IAB numbers as `"[TBC]"`.
  - `stats.ts`: years 10+, projects 120+, sq ft built 1.2M, team 25 (clearly dummy).
  - `services.ts`: 4 phases (Plan, Design, Engineer, Build), each with a description and 4 sub-services, plus 4 sectors (Residential, Commercial, Hospitality, Institutional).
  - `projects.ts`: 8 projects across Residential / Commercial / Interior / Construction with slug, title, category, location, year, size, scope, status, summary, brief, solution, 6 gallery placeholders, client quote, `modelUrl?: string`, `featured`.
  - `team.ts`: 6 leaders (generic names such as "Team Member 1", a role and a qualification) and 9 disciplines.
  - `clients.ts`: 6 placeholder client logos and 3 testimonials.
  - `content/journal/`: 6 MDX posts (categories Site update / Design / Handover / News) with frontmatter title, date, category, excerpt, cover and author.
- Translations in `messages/en.json` and `messages/bn.json` for all UI text (bn can be a first-pass translation, marked for review in PROJECT_PLAN).

### Phase 4: Layout (`feat/layout`)

- **Header:** logo (dark logo on white pages, light logo on the sky-blue or dark hero), nav (Home, About us, Services, Projects, Journal), EN | বাংলা switcher, orange "Contact us" pill. Sticky; turns white with a hairline border after scrolling. On mobile it collapses to a full-screen menu (Radix Dialog) with focus trap.
- **Footer:** dark (#141414), light logo, tagline, Company / Office / Follow columns, © line with licence numbers.
- Floating WhatsApp button (bottom right, accessible label).
- Lenis smooth scroll provider, disabled for reduced motion.
- Skip-to-content link.

### Phase 5: Pages (one branch per page: `feat/home-page`, `feat/about-page`, …)

Follow the approved design. All copy comes from `src/content` and `messages/`.

**Home `/`**

1. Hero on sky blue `#AECBE8`: light logo, H1 "For an environment to live." (orange underline highlight on "to live."), one-line description, buttons "View our projects" (dark) and "Who we are" (outline). Right side: the **3D logo scene** (Section 5.1). Static SVG fallback.
2. "who we are": statement heading, short paragraph, "More about us →", 4 stat cards (counters animate once on view).
3. "what we do" (dark section): the 4 numbered phases with sub-services on the left; the **3D phase model** on the right (Section 5.2), pinned while the phases scroll. Phase chips (01 Plan, 02 Design, 03 Engineer, 04 Build) highlight the active step.
4. "why chawni": 3 pillar cards with stroke icons (Designed with care / Engineered to last / Built as drawn).
5. "projects": 3 featured project cards + "See all projects →".
6. "our team": discipline chips with orange dots + 3 leader cards.
7. "trusted by": one large testimonial + client logo grid.
8. "journal": 3 latest posts.
9. Orange CTA band "Bring your vision to life. Let's talk." with "Send an inquiry" (dark) and "WhatsApp us" (outline).

**About us `/about`:** hero statement, wide team photo, our story (2 columns), mission and vision (dark section, orange top rules), leadership grid (6), registrations and recognition lists, CTA.

**Services `/services`:** hero, 4 alternating image/text blocks (big orange number, title, description, 4 bullet sub-services), sectors grid, CTA.

**Projects `/projects`:** hero, filter pills (All, Residential, Commercial, Interior, Construction) kept in the URL as `?category=` so filtered views can be shared, responsive card grid, empty state.

**Project detail `/projects/[slug]`:** back link, category, title, hero image, facts bar (Location, Client, Size, Scope, Completed), brief and solution, **"Explore in 3D"** section (Section 5.3) shown only when the project has a model (dummy projects use the procedural demo model), gallery with lightbox and "01 / 08" counter, client quote, next-project link. `generateStaticParams` + per-project metadata and OG image.

**Journal `/journal` and `/journal/[slug]`:** featured post, category filter, grid, pagination ("Load more" or numbered); article page with cover, meta, MDX body (styled prose), share links (Facebook, WhatsApp, copy link), related posts.

**Contact `/contact`:** heading "Let's build your environment to live.", office details (address, hours, phone, email), WhatsApp button, inquiry form (name, phone/WhatsApp, email, service select, message, honeypot field, server-side Zod validation, success and error states, rate-limit by IP in memory), Google Map embed placeholder (static image until a real address is supplied).

**Also:** `not-found.tsx` (branded 404), `error.tsx`, `loading.tsx` skeletons, `/privacy` (placeholder text).

### Phase 6: 3D (`feat/3d-scenes`)

Build the three scenes in Section 5. Each scene:

- lives in `src/components/three/`, is loaded with `next/dynamic` + `ssr: false`, and only mounts when near the viewport (IntersectionObserver)
- has a static fallback (SVG or image) for reduced motion, no WebGL, or low-power devices (`navigator.hardwareConcurrency <= 4` or Save-Data)
- caps the device pixel ratio at 1.75, pauses rendering when off screen, and disposes resources on unmount
- uses brand colours only: white and very light grey materials, orange `#F47C24` edges and lines, soft studio lighting, no textures needed

### Phase 7: SEO, performance and accessibility (`feat/seo-performance`)

- Metadata API on every page (title template "%s | Chawni Architectures"), Open Graph and Twitter cards, dynamic OG images with `next/og` using the logo.
- `sitemap.ts`, `robots.ts`, `hreflang` alternates for en/bn, canonical URLs.
- JSON-LD: `Organization` + `LocalBusiness` (`GeneralContractor`) on Home, `CreativeWork` on project pages, `Article` on journal posts.
- Images: `next/image`, AVIF/WebP, correct `sizes`, priority only for the hero.
- Run the bundle analyzer; keep three.js out of the shared chunk.
- Run Playwright + axe on every route and fix all serious or critical issues.

### Phase 8: Tests and CI (`test/coverage`)

- Unit tests: content helpers, form schema, filter logic, `Logo` variant switching.
- Playwright smoke: every route renders in en and bn, nav works, project filter updates the URL, contact form validation and success state, 404 page.
- CI must be green locally (`act` not required; run the same commands manually).

### Phase 9: Wrap-up (`main`)

- Update README and PROJECT_PLAN with final status. Generate CHANGELOG. Tag `v0.1.0`.
- Write `docs/HANDOVER.md`: what's done, what's dummy, exact steps to add real photos and data, how to add a real 3D model (`.glb` from SketchUp/Revit/Blender, compress with `gltf-transform` + Draco/Meshopt, put in `public/models/`, set `modelUrl` on the project).
- Print a final summary in the terminal: phases completed, test results, Lighthouse scores, and the list of content still needed.

---

## 4. Brand system

**Logo** (files in `public/brand/`, never alter):

- `chawni-logo-dark-on-light.svg`: full logo for white or light backgrounds (mark and tagline in ink).
- `chawni-logo-light-on-dark.svg`: full logo for sky-blue, dark or photo backgrounds (mark and tagline in white).
- `*-compact.svg`: the same without the small "architects & engineers" line, for the header.
- `chawni-mark-*.svg`: the mark with its orange Bangla tag; `chawni-icon-*.svg`: the mark only; `favicon.svg`, `apple-touch-icon.png`, `icon-512.png`.
- **Rule:** orange `#F47C24` never changes. The parts that are white on dark backgrounds become ink `#141414` on light backgrounds. Minimum clear space around the logo is the height of the orange tag. Minimum header width is 120px.

**Colour tokens**

| Token                 | Hex       | Use                                                                   |
| --------------------- | --------- | --------------------------------------------------------------------- |
| `--color-orange`      | `#F47C24` | Fixed brand accent: buttons, markers, numbers, rules. Never body text |
| `--color-orange-text` | `#C2560E` | Small orange labels on white (passes contrast)                        |
| `--color-ink`         | `#141414` | Text, dark sections, text on orange                                   |
| `--color-white`       | `#FFFFFF` | Page base                                                             |
| `--color-sky`         | `#AECBE8` | From the logo: hero and soft feature panels                           |
| `--color-mist`        | `#F5F7F9` | Soft section backgrounds                                              |
| `--color-line`        | `#E4E6E9` | Borders and dividers                                                  |
| `--color-muted`       | `#5C6066` | Secondary text                                                        |
| `--color-dark-2`      | `#1E2124` | Panels inside dark sections                                           |

- Text on orange is always ink, never white.
- **Type scale (fluid with clamp):** display 46→86px, h2 36→64px, h3 24px, body 17–18px, small 14px, label 12–14px. Sora 600 for headings with tight letter-spacing (−0.02 to −0.03em); Inter 400/500/600 for body.
- **Shape:** 4px radius on cards and images, pill buttons, generous whitespace (section padding about 80–130px desktop, 64px mobile), max content width 1440px with 20px → 72px side padding.
- **Motion:** subtle and purposeful. Fade-up on enter (16px, 0.6s), counters on view, image reveal. Nothing bouncy. Everything off with reduced motion.

---

## 5. The 3D scenes

### 5.1 Hero: the logo becomes a building

The mark is drawn from single-weight strokes. Use these exact polylines (SVG coordinate space 850 × 800, stroke width 19, miter joins). They are the same lines as in `public/brand/chawni-icon-dark.svg`:

```ts
export const MARK_LINES: [number, number][][] = [
  [
    [285, 635],
    [285, 320],
    [150, 185],
    [55, 270],
    [55, 525],
  ],
  [
    [55, 525],
    [140, 440],
  ],
  [
    [100, 335],
    [225, 470],
    [60, 635],
    [155, 728],
  ],
  [
    [300, 45],
    [232, 100],
    [405, 265],
    [405, 505],
    [480, 412],
    [545, 470],
    [385, 635],
    [320, 560],
  ],
  [
    [500, 45],
    [427, 105],
    [580, 255],
    [580, 635],
  ],
  [
    [560, 45],
    [800, 270],
    [800, 665],
  ],
  [
    [800, 470],
    [745, 415],
    [635, 510],
    [725, 600],
  ],
];
// orange tag below the mark: polygon [[210,700],[805,700],[805,800],[300,800]]
```

Sequence, driven by scroll (GSAP ScrollTrigger scrubbing a 0→1 progress value; the hero is pinned for about 150% of the viewport height):

1. **0–0.25:** each stroke segment is a thin white bar (a box along the segment, depth 0.1). Segments start scattered and rotated around the scene and float into place to form the flat logo, facing the camera. The orange tag slides in last.
2. **0.25–0.55:** the strokes extrude backward into tall wall-like slabs (depth grows to about 120 units in mark space). Edges get thin orange outlines (`EdgesGeometry`). The camera orbits from front view to a three-quarter isometric view.
3. **0.55–0.85:** the logo now reads as an architectural model: the walls stand on a white base plate, a thin roof slab fades in above, and soft contact shadows appear.
4. **0.85–1:** the camera settles. Idle state: a slow 6° sway, a subtle parallax response to the pointer, and no further animation.

- Materials: matte white `MeshStandardMaterial` (roughness 0.8), orange `#F47C24` lines, a light sky-blue environment matching the hero background. Use `<ContactShadows>` and soft directional light.
- Fallback: the static hero SVG illustration (the isometric model with floating logo pieces).

### 5.2 "What we do": one model, four states

A simple modern two-storey building (procedural: boxes for plinth, columns, slabs, walls, glass and a cantilevered upper floor). Its state follows the active phase:

- **01 Plan:** only the site plan, drawn as orange lines on a white ground plate (lines animate in).
- **02 Design:** a white massing model, with volumes rising out of the plan.
- **03 Engineer:** walls fade out to show the structural frame: columns, beams, slabs and dashed orange grid lines.
- **04 Build:** the finished building: walls, glass (transparent, slight reflection), warm interior light, a few simple trees.
  Transitions take 0.8s with eased tweens. The chips and the scroll position stay in sync, and clicking a chip scrolls to that phase.

### 5.3 Project page: "Explore in 3D"

- `ProjectModelViewer` loads `project.modelUrl` (GLB, Draco/Meshopt) with `useGLTF`. With no model, show the procedural demo building from 5.2.
- Controls: OrbitControls with damped rotation, limited polar angle and zoom; buttons "Rotate" (auto-rotate toggle), "Explode floors" (each floor group moves apart vertically, smoothly), "Show photos" (hotspots).
- Hotspots: orange dots anchored to 3D positions (`<Html>` from drei). Clicking one opens that gallery photo in the lightbox. Hotspots are keyboard-focusable buttons with labels.
- A loading progress indicator, plus a poster image until the user presses "Load 3D view" on mobile (saves data).

---

## 6. Folder structure (target)

```
.
├── .github/workflows/ci.yml
├── .husky/
├── brand/                    # source logo files (also copied to public/brand)
├── content/journal/*.mdx
├── docs/ (PROJECT_PLAN, ARCHITECTURE, CONTENT_GUIDE, BRAND, DECISIONS, HANDOVER)
├── messages/ (en.json, bn.json)
├── public/ (brand/, placeholders/, models/)
├── src/
│   ├── app/[locale]/ (page.tsx, about/, services/, projects/[slug]/, journal/[slug]/, contact/, privacy/)
│   ├── app/ (sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, not-found.tsx)
│   ├── components/ (ui/, layout/, sections/, three/, forms/)
│   ├── content/ (company.ts, stats.ts, services.ts, projects.ts, team.ts, clients.ts, index.ts)
│   ├── lib/ (content-source.ts, mdx.ts, seo.ts, utils.ts, validation.ts)
│   ├── i18n/ (routing.ts, request.ts)
│   └── styles/ (globals.css, tokens.css)
├── tests/ (unit/, e2e/)
├── CHANGELOG.md  CONTRIBUTING.md  README.md  .env.example
```

---

## 7. Definition of done

- Every page in Section 3 exists in en and bn, matches the brand system, and works from 360px to 1920px wide.
- All three 3D scenes work, lazy-load, have fallbacks and keep 60 fps on a mid-range laptop.
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e` all pass.
- Lighthouse mobile ≥ 90 in all four categories on Home, Projects and Contact (report the scores).
- Git history: conventional commits, one merged branch per phase, tag `v0.1.0`, CHANGELOG generated.
- All dummy content is in `src/content/` and `content/journal/`, every file marked, and `docs/CONTENT_GUIDE.md` explains how to replace it.

Start now with Phase 1.
