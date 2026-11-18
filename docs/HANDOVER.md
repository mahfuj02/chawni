# Handover

Status of the Chawni Architectures website at **v0.2.0** (real content).

## What is done

- All pages in English and Bangla: Home, About, Services, Projects (+ detail), Journal (+ article), Contact,
  Privacy, branded 404, error boundary, skeletons.
- **Real content (v0.2.0):** 25 projects with 269 enhanced photos, 5 categories and status badges, the real team
  with black-and-white portraits, 12 interactive 3D massing models with photo hotspots, real phones and email,
  six journal drafts.
- Design system, header, footer, WhatsApp button, smooth scroll, skip link.
- 3D: hero logo-to-building scene, "what we do" phase scene, and the project viewer (orbit, auto-rotate, explode
  floors, hotspots that open the gallery lightbox).
- SEO: metadata, canonical + hreflang, sitemap (all 25 projects), robots, JSON-LD, OG cards using each project's
  cover photo.
- Contact form: Zod validation, honeypot, in-memory rate limit, Resend email.
- Quality: ESLint, strict TypeScript, unit tests, Playwright tests (including axe on every route in both
  languages), Husky + commitlint + lint-staged, GitHub Actions CI. Media is tracked with Git LFS.

## Still missing (needs you)

| Item                                                                                               | Where to add it                                     |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Office street address** (shown as "[TBC], Sylhet, Bangladesh"), then a real map embed            | `src/content/company.ts`, contact page              |
| **Exact years and areas** for projects that have none                                              | `src/content/projects.ts` (`year`, `area`)          |
| **Engr. Shitol Ahmed's role** (hidden while "[Role TBC]")                                          | `src/content/team.ts`                               |
| **Photos for Mahjan Prova and Shitol Ahmed** (initials tiles are shown)                            | `public/team/`, `team.ts`, then `pnpm content:blur` |
| **Real client logos** (text wordmarks are shown)                                                   | `src/content/clients.ts`                            |
| **Journal review:** six drafts marked `review: true`; dates are placeholders                       | `content/journal/*.mdx`                             |
| Confirm the hotspot for "Green boundary wall" on `duplex-akhalia` (it had no photo 3, now photo 2) | `src/content/projects.ts`                           |
| Confirm "Engr. Masum Parvez" spelling (the slides said "Paevej") and the photo credits             | `team.ts`, `projects.ts`                            |
| Real testimonials (none are shown), social links, opening hours                                    | `clients.ts`, `company.ts`                          |
| Licence and IEB/IAB numbers (`[TBC]`), privacy policy text                                         | `company.ts`, `messages/*.json`                     |
| Native review of all Bangla text; Bangla versions of project summaries                             | `messages/bn.json`, `projects.ts`                   |

## How to change things

See [CONTENT_GUIDE.md](CONTENT_GUIDE.md): adding a project, photo sizes and naming, `pnpm content:blur`, adding or
replacing a 3D model (GLB conventions and compression), team, journal and translations.

## Environment variables

Copy `.env.example` to `.env.local` (never commit it).

| Variable               | Purpose                                                           |
| ---------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Real domain, **required for correct canonical URLs, sitemap, OG** |
| `RESEND_API_KEY`       | Sends inquiry emails. Without it, production returns an error     |
| `CONTACT_TO_EMAIL`     | Where inquiries go (set this: the default is only a placeholder)  |
| `CONTACT_FROM_EMAIL`   | Verified sender in Resend                                         |
| `CONTACT_DRY_RUN`      | `1` logs inquiries instead of emailing (used by the e2e tests)    |

## Deploying (Vercel)

1. Import the repo (the media is in Git LFS: enable LFS in the project settings or build with `git lfs pull`).
2. Set the variables above, Node 20+.
3. After the first deploy, run Lighthouse on the live URL and add the Google Maps embed once the address is known.

## Commands

```bash
pnpm dev
pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm test:e2e   # everything CI runs
pnpm content:blur   # regenerate blur placeholders after adding photos
pnpm analyze        # bundle analyzer (webpack build)
?force3d=1          # add to any URL to run 3D on a low-power device for testing
```

## Known limitations

- **Performance score.** See the Lighthouse results in the README and `docs/DECISIONS.md`. Images are served as
  WebP, lazy-loaded, with the 1200 px variants and blur placeholders; re-measure on the deployed site.
- **Bangla:** UI is translated (first pass, needs review). Project summaries, scopes, locations, roles and
  journal bodies are English only.
- **Massing models** are built from renders, not surveys. They are labelled as such on the page.
- **OG images** use English titles (the default OG font has no Bengali glyphs).
- **Rate limiting** is in memory. Use a shared store (Upstash/Redis) if abuse appears.
- **No CMS yet.** `ContentSource` (`src/lib/content-source.ts`) is the seam for adding one.
