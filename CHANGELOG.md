# [0.4.0](/compare/v0.3.0...v0.4.0) (2026-11-18)


### Features

* **hero:** restore the shade overlay and keep the copy clear of the header on short viewports
* **intro:** add a 3D logo intro before the hero (Home, first visit per session, skippable, separate chunk)
* **home:** replace the procedural 3D building with a real-image project sequence (plan, design, engineer, build)


### Bug Fixes

* **a11y:** make breadcrumb, contact and frame-caption links 44px
* **i18n:** use the Bangla name ছাউনি in the footer, a project title and the journal byline


### Styles

* **brand:** use the orange-text token for large numerals on white
* **team:** black-and-white portraits and no placeholder tiles


# [0.3.0](/compare/v0.2.0...v0.3.0) (2026-11-18)


### Features

* **3d:** load real project models with explode and photo hotspots 2f341de
* **content:** add enhanced project photos, team portraits and 3d models 03e6554
* **content:** generate blur placeholders for project and team photos 2c0e0e1
* **content:** replace remaining placeholders, real contacts and journal a0ef790
* **hero:** add hero images and depth maps 28c44d5
* **hero:** replace logo scene with depth-parallax project slideshow c512dc7
* **projects:** replace dummy projects with real portfolio 6bb01e7
* **seo:** real project metadata and images 89f3ca0


### Performance Improvements

* **hero:** make the hero image the LCP and start WebGL on first interaction 5fdf77a
* load photos lazily within 300px of the viewport af590f7

# [0.1.0](/compare/90f3d9b1539edc5a367cdd5e855343f07a485aa5...v0.1.0) (2026-11-18)


### Bug Fixes

* **a11y:** resolve axe findings (label in name, dl structure, contrast) 342a0c2, closes #B8510C
* **a11y:** use h2 for cards that follow the page title on listing pages 75f228e
* **projects:** keep the lightbox photo from covering its controls e1f7660
* return real 404 status by scoping loading skeletons to leaf routes 440ab75


### Features

* **3d:** add capability gate, viewport tracking and self-hosted Draco decoders a7fdcaf
* **3d:** add Explore in 3D viewer with orbit, explode floors and photo hotspots 5d5bb21
* **3d:** add scroll-driven hero scene where the logo becomes a building b57c965
* **3d:** add what-we-do scene with four building states 37c3ac3
* **about:** add about page 050d2c3
* add branded 404, error boundary and loading skeleton 47545dd
* add design tokens, fonts and locale layout 3b7399d
* **contact:** add contact page and accessible inquiry form b412110
* **contact:** add inquiry server action with honeypot, rate limit and Resend c885c66
* **contact:** add Zod schema and in-memory rate limiter c30c225
* **content:** add ContentSource, MDX journal posts and filter helpers 673a02a
* **content:** add typed dummy content 716e39e
* **home:** add format helpers, ArrowLink and time zone config b62e9e9
* **home:** add hero and who-we-are section with stats 2bdcd18
* **home:** add pinned what-we-do phases section 12405a9
* **home:** add shared cards, CTA band and static 3D fallbacks 6bc4945
* **home:** add why, projects, team, trusted-by and journal sections c4dc85c
* **i18n:** add en and bn translations 5f5e946
* **i18n:** add next-intl routing for en and bn 90f3d9b
* **journal:** add article page with MDX body, share links and related posts 083b521
* **journal:** add listing with featured post, filter and load more d6578fd
* **layout:** add footer and floating WhatsApp button 11002fe
* **layout:** add skip link and Lenis smooth scroll 3d255a8
* **layout:** add sticky header with mobile dialog menu b1b7ed0
* **layout:** wire layout shell into locale layout 9e998fd
* **privacy:** add placeholder privacy page c705ac4
* **projects:** add category filter synced to the URL 30d0a03
* **projects:** add demo-model switch for Explore in 3D 42e835f
* **projects:** add gallery lightbox and media section d73d741
* **projects:** add project detail page f4f46f6
* **projects:** add projects listing page 012630e
* **seo:** add branded OG images generated with next/og 9e59c29
* **seo:** add JSON-LD for organization, projects and articles 1700f56
* **seo:** add pageMetadata helper with canonical and hreflang 6ebcff3
* **seo:** add sitemap with hreflang alternates and robots e28a6c1
* **services:** add services page with phases and sectors 9f91d81
* **ui:** add design-system components d937c70


### Performance Improvements

* **3d:** start hero scene on first interaction and probe WebGL lazily 521a558
* **contact:** code-split the form and load zod on demand 35ad06d
* **i18n:** precompile ICU messages at build time 9de55b3
* **layout:** lazy-load the mobile menu dialog and Lenis 3ea59b0
* send only client namespaces and preload only needed fonts 0c6c081
* **ui:** make Reveal a pure-CSS scroll-driven animation ec50983
