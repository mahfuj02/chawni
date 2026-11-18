# Content guide: replacing dummy data

Every dummy file begins with `// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)`.
Remove that line once the file holds real content.

## Files

| What                         | Where                                  |
| ---------------------------- | -------------------------------------- |
| Company name, contact, links | `src/content/company.ts`               |
| Stats                        | `src/content/stats.ts`                 |
| Phases and sectors           | `src/content/services.ts`              |
| Projects                     | `src/content/projects.ts`              |
| Team and disciplines         | `src/content/team.ts`                  |
| Clients, testimonials        | `src/content/clients.ts`               |
| Journal posts                | `content/journal/*.mdx`                |
| UI text                      | `messages/en.json`, `messages/bn.json` |

## Photos

1. Put files in `public/images/<area>/` (e.g. `public/images/projects/<slug>/01.jpg`).
2. Naming: lowercase, hyphens, numbered gallery files `01.jpg`, `02.jpg`.
3. Sizes: hero 2400×1350 (16:9); gallery 1800px wide; portraits 800×1000; client logos SVG preferred.
   JPG/WebP under 400 KB each after export. Next.js serves AVIF/WebP automatically.
4. In the content file set `image: { src: "/images/...", alt: "..." }`. While `src` is empty the
   `PlaceholderImage` is shown; the layout does not change.

## Alt text rules

Describe what is visible and why it matters, in one sentence, without "image of". Decorative images get `alt=""`.
Provide both `en` and `bn` alt text.

## Adding a project

Copy an entry in `projects.ts`, give it a unique `slug`, fill each field in `en` and `bn`, add gallery
images, set `featured: true` to show it on Home (3 are shown). For a 3D model see `docs/HANDOVER.md`.

## Adding a journal post

Create `content/journal/<slug>.mdx` with frontmatter: `title`, `date` (YYYY-MM-DD), `category`
(Site update | Design | Handover | News), `excerpt`, `cover`, `author`.

## Translations

Edit `messages/bn.json`. Bangla is a first-pass translation that needs a native review.
