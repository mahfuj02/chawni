# Architecture

## Folder structure

```
src/app/[locale]/        routes (home, about, services, projects, journal, contact, privacy)
src/app/                 sitemap, robots, manifest, OG image
src/components/ui        design-system primitives
src/components/layout    header, footer, whatsapp, smooth-scroll
src/components/sections  page sections
src/components/three     3D scenes (client-only, lazy)
src/components/forms     contact form
src/content              typed dummy data (single source of truth)
src/lib                  content-source, mdx, seo, utils, validation
src/i18n                 routing + request config
src/styles               tokens.css
content/journal          MDX posts
messages                 en.json, bn.json
```

## Rendering strategy

Server Components by default; every page is statically generated for both locales
(`generateStaticParams`, `setRequestLocale`). Client components are limited to interactive pieces
(header menu, filters, form, lightbox, counters, 3D). The contact form posts to a Server Action.

## Content layer

Pages call `getContentSource()` (`src/lib/content-source.ts`), which returns a `ContentSource`
(`getProjects`, `getProject`, `getPosts`, `getPost`, `getTeam`, ...). The default implementation reads
`src/content` and `content/journal`. To adopt Sanity, implement the same interface and switch the factory.

## i18n

`next-intl`, locales `en` (default) and `bn`, prefix always. `proxy.ts` negotiates locale. UI text lives in
`messages/*.json`; content fields that need translation are `{ en, bn }` objects (`Localized`). In `bn` the
`<html>` gets a class that swaps Sora/Inter for Hind Siliguri. `hreflang` alternates come from `lib/seo.ts`.

## 3D loading strategy

Scenes live in `components/three`. Wrappers use `next/dynamic({ ssr: false })` and mount only when near the
viewport (IntersectionObserver). A static fallback renders for reduced motion, no WebGL, or low-power devices
(`hardwareConcurrency <= 4`, Save-Data). DPR is capped at 1.75, rendering pauses off-screen, and geometries
and materials are disposed on unmount. three.js never enters the shared chunk.

## Performance approach

Static generation, `next/font` self-hosting, `next/image` (AVIF/WebP, `sizes`, hero-only priority), minimal
client JS for non-3D pages (< 200 KB gz), lazy 3D, animations opt-out under `prefers-reduced-motion`.
Verify with `pnpm analyze` and Lighthouse mobile.
