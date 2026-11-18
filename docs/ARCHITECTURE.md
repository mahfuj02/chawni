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

The procedural "what we do" building is gone (v0.4.0); the only scene left in `components/three` is the project GLB viewer. Scenes live there. Wrappers use `next/dynamic({ ssr: false })` and mount only when near the
viewport (IntersectionObserver). A static fallback renders for reduced motion, no WebGL, or low-power devices
(`hardwareConcurrency <= 4`, Save-Data). DPR is capped at 1.75, rendering pauses off-screen, and geometries
and materials are disposed on unmount. three.js never enters the shared chunk.

## Performance approach

Static generation, `next/font` self-hosting, `next/image` (AVIF/WebP, `sizes`, hero-only priority), minimal
client JS for non-3D pages (< 200 KB gz), lazy 3D, animations opt-out under `prefers-reduced-motion`.
Verify with `pnpm analyze` and Lighthouse mobile.

## Home hero (v0.3.0)

A full-screen slideshow of four real projects with a depth-parallax "living photo" effect.
Source of truth: `src/content/hero.ts`; code in `src/components/sections/hero/`.

- **Static LCP layer (server).** `Hero.tsx` renders slide 1 as a `priority` `next/image` (`fill`, `sizes="100vw"`, blur
  placeholder, `object-position` from the slide's focus values via CSS variables), the shade gradients, the copy and
  the buttons. It works without JavaScript and is the LCP element. The layer is 2 px shorter than the viewport on
  purpose: Chrome never counts a full-viewport image as an LCP candidate (it treats it as a background).
- **Controls (client).** `HeroSlideshow.tsx` owns the slide index, the 7 s clock (time only counts while running, so
  pausing keeps the remaining time), pause on hover and focus, a visible Pause/Play button, the progress-bar buttons,
  arrow-key navigation and the `aria-live` caption. Captions are looked up from the project (`lib/hero-caption.ts`).
- **Depth layer (WebGL).** `hero-gl.ts` is a ~2 KB plain WebGL 1 fullscreen-quad renderer, a direct port of the approved
  prototype's shader: cover-fit with focus and zoom, depth displacement from the pointer (slow drift on touch) and scroll,
  a 1.6 s crossfade and a Ken Burns zoom. `HeroGL.tsx` mounts it via `next/dynamic` (`ssr: false`) on the first
  interaction or after 4 s, scheduled with `requestIdleCallback`. Slide 1's textures load first; only then does the canvas
  fade in over the static image. The other slides load in the background. It uses the 1280 px textures on narrow screens,
  Save-Data and 2g/3g.
- **Safety.** The render loop pauses when the hero is off screen or the tab is hidden; textures are released on unmount;
  `webglcontextlost` or missing WebGL falls back to the static image; reduced motion never mounts the canvas (slides
  still change by hand, instantly, with no Ken Burns or parallax).
- **Header.** On Home the header is fixed and transparent (light logo, white links) and becomes the normal white header
  after 80% of the hero has scrolled past. Other pages keep the sticky white header.

## Logo intro (v0.4.0)

`components/intro/`: `Intro.tsx` (server), `LogoIntro.tsx` (client), `logo-intro-scene.ts` (three.js, a port of the approved `intro.js`), rules in `lib/intro-gate.ts`.

- **Gating.** Home only, first visit per session (`sessionStorage` key `chawni-intro`, try/catch). Skipped for reduced motion, `navigator.webdriver`, Save-Data, bots and Lighthouse user agents, and when WebGL is missing. One pure function, `shouldPlayIntro`, holds the rule (unit-tested). A ~400-byte inline script runs the same checks before first paint and sets `<html data-intro="playing">`.
- **No flash, no LCP cost.** The server renders the overlay as a plain dark div that CSS only shows under that attribute. The hero (and its LCP `next/image`) renders underneath from the start.
- **Chunking.** three.js and the scene are a dynamic `import()` inside `LogoIntro`, so they never enter the Home first-load JS (checked: no three.js code is fetched when the intro is skipped). If the chunk has not arrived after 1.2 s the intro is skipped. Everything (geometry, materials, renderer, listeners) is disposed when it ends or the component unmounts.
- **Hand-off.** While the attribute is set, CSS pauses the hero's entrance animations and scales the hero from 1.08 to 1 (`--reveal-scale`), and `HeroSlideshow` holds its clock and the WebGL start. When the intro ends (or "Skip intro", Esc, Enter or Space is used) the attribute is removed, so the headline animates in right after the reveal. Focus moves to `#main` if it was on the skip button.

## What we do sequence (v0.4.0)

`WhatWeDo.tsx` (chips, phases, pinning) and `WhatWeDoStage.tsx` (the four frames). Data: `content/what-we-do.ts`; the plan drawing is inlined from `public/what-we-do/plan.svg` as `content/plan-markup.ts`.

- A 4:3 frame is pinned with CSS `position: sticky` while the phases scroll; an IntersectionObserver sets the active phase and the chips mirror it (`aria-current="step"`; clicking a chip scrolls to the phase with Lenis).
- Each frame animates with CSS transitions toggled by classes: plan (stroke-dash draw of walls, openings and glazing; fades for grid, columns and dimensions), design (clip-path wipe plus slow zoom), engineer (image dims to 55% and an orange dashed grid draws), build (cross-fade and a sliding badge). Frames covered by a later one are hidden after the cross-fade.
- Phones and reduced motion: nothing is pinned or animated; `StaticFrame` shows each phase's frame in its final state under its text.
