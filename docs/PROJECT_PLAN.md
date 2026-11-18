# Project plan

## Goals

1. Present Chawni as a credible architecture, engineering, interior and construction firm.
2. Convert visitors into inquiries (form, WhatsApp, phone).
3. Showcase projects, with 3D models where available.
4. Work in English and Bangla, fast on mobile, accessible (WCAG 2.2 AA).
5. Let non-developers replace content without touching components.

## Audience

Homeowners and developers in Bangladesh planning a build or renovation; commercial and institutional
clients; prospective hires and partners. Many visit on mobile over modest connections.

## Sitemap

`/en` and `/bn` prefixes on every route.

```
/                  Home
/about             About us
/services          Services
/projects          Projects (?category=)
/projects/[slug]   Project detail (+ Explore in 3D)
/journal           Journal (?category=&page=)
/journal/[slug]    Article
/contact           Contact
/privacy           Privacy
```

## Page sections

- **Home:** hero + 3D logo · who we are + stats · what we do + 3D phase model · why chawni · featured projects · team · trusted by · journal · CTA.
- **About:** hero statement · team photo · story · mission/vision · leadership · registrations · CTA.
- **Services:** hero · 4 phase blocks · sectors · CTA.
- **Projects:** hero · category filter · grid · empty state.
- **Project detail:** facts bar · brief/solution · Explore in 3D · gallery + lightbox · quote · next project.
- **Journal:** featured · filter · grid · load more. Article: cover, meta, MDX, share, related.
- **Contact:** details · WhatsApp · inquiry form · map placeholder.

## Content model

Typed modules in `src/content/` (`company`, `stats`, `services`, `projects`, `team`, `clients`) and MDX in
`content/journal/`. Accessed only via the `ContentSource` interface in `src/lib/content-source.ts`, so a CMS
(Sanity) can replace the local source without touching pages. UI strings live in `messages/{en,bn}.json`.

## Phases and acceptance criteria

| #   | Phase                | Branch                 | Acceptance                                                      |
| --- | -------------------- | ---------------------- | --------------------------------------------------------------- |
| 1   | Scaffold and tooling | `main`                 | Hooks, CI file, scripts, brand assets in place; build green     |
| 2   | Docs                 | `docs/project-plan`    | All docs listed in the brief exist                              |
| 3   | Design system + data | `feat/design-system`   | Tokens, fonts, ui components, dummy content, translations       |
| 4   | Layout               | `feat/layout`          | Header, footer, WhatsApp, Lenis, skip link; en/bn routing works |
| 5   | Pages                | `feat/*-page`          | Every route renders in en and bn from content                   |
| 6   | 3D                   | `feat/3d-scenes`       | 3 scenes, lazy, fallbacks, brand colours                        |
| 7   | SEO / perf / a11y    | `feat/seo-performance` | Metadata, sitemap, JSON-LD, OG, axe clean                       |
| 8   | Tests and CI         | `test/coverage`        | Unit + e2e green                                                |
| 9   | Wrap-up              | `main`                 | HANDOVER, CHANGELOG, tag `v0.1.0`                               |

## Risks

- **3D weight / performance:** lazy loading, viewport gating, fallbacks, DPR cap. Verify with the analyzer.
- **Bangla quality:** first-pass translation needs a native review.
- **Placeholder content shipping live:** every dummy file is marked; `HANDOVER.md` lists them.
- **Real 3D models too heavy:** compress with gltf-transform + Draco/Meshopt before adding.
- **Spam on the contact form:** honeypot + in-memory IP rate limit (swap for a shared store if scaled).

## Status

_Updated in Phase 9._

## Content needed from Chawni

- [ ] Photos for each project (hero + gallery, min 2400px wide) and permission to publish them
- [ ] Optional 3D models (`.glb`) per project
- [ ] Team group photo, leader portraits and bios
- [ ] Real statistics (years, projects, area built, team size)
- [ ] Licences and registrations (trade licence, IEB/IAB numbers)
- [ ] Client logos (with permission) and real testimonials
- [ ] Office address, hours, phone, WhatsApp, email, map location
- [ ] Social links (Facebook, LinkedIn, Instagram, YouTube)
- [ ] Journal posts and cover images
- [ ] **Bangla copy review** (all of `messages/bn.json` and dummy content is a first pass)
- [ ] Privacy policy text approved by the owner
