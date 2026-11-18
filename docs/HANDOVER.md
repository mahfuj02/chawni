# Handover

Status of the Chawni Architectures website at **v0.1.0**.

## What is done

- All pages in both languages (`/en`, `/bn`): Home, About, Services, Projects (+ detail), Journal
  (+ article), Contact, Privacy, branded 404, error boundary, skeletons.
- Design system, header (mobile menu), footer, WhatsApp button, smooth scroll, skip link.
- Three lazy-loaded 3D scenes (hero logo-to-building, "what we do" phases, project "Explore in 3D"),
  each with a static fallback.
- SEO: metadata, canonical + hreflang, sitemap, robots, JSON-LD, generated OG images.
- Contact form: Zod validation (browser + server), honeypot, in-memory rate limit, Resend email.
- Quality gates: ESLint, strict TypeScript, 79 unit tests, 73 Playwright tests (including axe on
  every route in both languages), Husky + commitlint + lint-staged, GitHub Actions CI.

## What is dummy (and must be replaced)

Everything below is sample content. Each file is marked `// DUMMY DATA`.

| Area                                     | File                          |
| ---------------------------------------- | ----------------------------- |
| Company name details, address, phone ... | `src/content/company.ts`      |
| Stats (10+, 120+, 1.2M, 25)              | `src/content/stats.ts`        |
| Phases and sectors                       | `src/content/services.ts`     |
| 8 projects                               | `src/content/projects.ts`     |
| Team leaders and disciplines             | `src/content/team.ts`         |
| Clients and testimonials                 | `src/content/clients.ts`      |
| 6 journal posts                          | `content/journal/*.mdx`       |
| Privacy text                             | `messages/*.json` (`privacy`) |
| Registration numbers                     | `"[TBC]"` in `company.ts`     |
| All Bangla text                          | `messages/bn.json` + `*.ts`   |

All photos are **placeholders** (`PlaceholderImage`). No real photo, logo of a client, licence number,
address, phone number or social link has been supplied yet.

## Replacing content

See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the full guide. The short version:

1. Edit the typed file in `src/content/` (English and Bangla side by side).
2. Remove the `// DUMMY DATA` line once the file holds real data.
3. Run `pnpm test` (it checks every project has 6 gallery images, translations match, etc.).

### Adding real photos

1. Export JPG/WebP, hero 2400×1350, gallery 1800px wide, portraits 800×1000, under ~400 KB.
2. Copy to `public/images/projects/<slug>/01.jpg ... 06.jpg` (and `public/images/team/`, `public/images/journal/`).
3. In the content file set `src` on the image (`hero: { src: "/images/projects/<slug>/01.jpg", ... }`, each
   `gallery[i].src`, `leaders[i].photo.src`). Write real `alt` text in both languages.
4. For journal posts set `cover:` in the MDX frontmatter to the path (a value starting with `/` is a path; anything
   else is the placeholder caption).
5. The layout does not change: `PlaceholderImage` and the real image share the same sized wrapper.

### Adding a project / a journal post

Copy an entry in `projects.ts` (unique `slug`), or add `content/journal/<slug>.mdx` with frontmatter
`title`, `date`, `category` (Site update | Design | Handover | News), `excerpt`, `cover`, `author`
(and optional `title_bn`, `excerpt_bn`).

## Adding a real 3D model

The project page shows a procedural demo building until a model exists.

1. Export a `.glb` from SketchUp, Revit or Blender. Keep each **floor as its own top-level object**, named from
   bottom to top, so "Explode floors" can separate them. Use metres and put the origin near the building.
2. Compress it (usually 5–20× smaller):

   ```bash
   npx @gltf-transform/cli optimize house.glb public/models/house.glb --compress draco --texture-compress webp
   # or --compress meshopt
   ```

   Aim for under ~5 MB. The viewer scales the model to a standard size and sits it on the ground by itself.

3. Put the file in `public/models/` and set it on the project:

   ```ts
   modelUrl: "/models/house.glb",
   ```

4. When every project has its own model, set `DEMO_MODELS = false` in `src/content/projects.ts` so the
   section only appears for projects that have a `modelUrl`.

Draco decoders are self-hosted in `public/draco/`, so no third-party CDN is needed.

## Environment variables

Copy `.env.example` to `.env.local` (never commit it).

| Variable               | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Real domain, **required for correct canonical URLs, sitemap, OG** |
| `RESEND_API_KEY`       | Sends inquiry emails. Without it, production returns an error     |
| `CONTACT_TO_EMAIL`     | Where inquiries go                                                |
| `CONTACT_FROM_EMAIL`   | Verified sender in Resend                                         |
| `CONTACT_DRY_RUN`      | `1` logs inquiries instead of emailing (used by the e2e tests)    |

## Deploying (Vercel)

1. Import the repo, framework preset Next.js, Node 20+.
2. Set the variables above.
3. After the first deploy, re-run Lighthouse on the live URL (see below) and add the Google Maps embed to
   `src/app/[locale]/contact/page.tsx` once the office address is confirmed.

## Commands

```bash
pnpm dev            # develop
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e   # everything CI runs
pnpm analyze        # bundle analyzer (webpack build)
?force3d=1          # add to any URL to run 3D on a low-power device for testing
```

Lighthouse (mobile): `pnpm dlx lighthouse@12 https://your-site/en --only-categories=performance,accessibility,best-practices,seo`.

## Known limitations

- **Performance score.** Local Lighthouse runs (software GL, simulated mobile) gave Contact 81–90,
  Projects 83–87, Home 62–79; accessibility 98–100, best practices 100, SEO 100. Observed FCP/LCP are
  ~0.5 s; the simulated score is held back by framework JS and hydration. Re-measure on the deployed site.
- **Bangla** is a first-pass translation and needs a native review. Journal bodies are English only.
- **OG images** use English titles (the default OG font has no Bengali glyphs).
- **Rate limiting** is in memory (per server instance). Use a shared store (Upstash/Redis) if abuse appears.
- **No CMS yet.** `ContentSource` (`src/lib/content-source.ts`) is the seam: implement it for Sanity and switch
  `getContentSource()`.
- **Map** is a static placeholder until a real address exists.
