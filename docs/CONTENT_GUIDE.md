# Content guide

How to change what the site says and shows. The site is driven by typed files in `src/content/` and MDX in
`content/journal/`. Real projects, photos, team and 3D models are already in place (v0.2.0).

## Where things live

| What                                 | Where                                        |
| ------------------------------------ | -------------------------------------------- |
| Company name, phones, email, address | `src/content/company.ts`                     |
| Projects (25)                        | `src/content/projects.ts`                    |
| Project photos                       | `public/projects/<slug>/`                    |
| 3D models                            | `public/models/<slug>.glb`                   |
| Team and portraits                   | `src/content/team.ts`, `public/team/`        |
| Clients (text wordmarks for now)     | `src/content/clients.ts`                     |
| Phases and sectors (generic copy)    | `src/content/services.ts`                    |
| Journal                              | `content/journal/*.mdx`                      |
| UI text, both languages              | `messages/en.json`, `messages/bn.json`       |
| Image blur placeholders (generated)  | `src/content/blur.json` (never edit by hand) |

Home stats (projects, sectors, models, team) are computed from the data, so they update on their own.

## Adding a new project

1. **Folder.** Create `public/projects/<slug>/`. The slug is lowercase with hyphens, e.g. `new-mosque`.
2. **Photos.** For each photo, export two files:
   - `<slug>-NN.jpg`: full size, **max 2400 px** on the long edge
   - `<slug>-NN-1200.jpg`: web size, **1200 px** on the long edge

   Number from `01`. **`-01` is the cover** and must be the first photo. JPG, roughly 80–85 % quality.

3. **Data.** Copy an existing entry in `src/content/projects.ts` and fill in:
   - `slug`, `title` (and `titleBn` if you have it), `category`
     (`Residential | Commercial | Hospitality | Interior | Institutional`), `scope`, `status`
     (`Completed | In progress | Construction starting | Proposed | Design`), `location`, `summary`
   - Optional: `area`, `year`, `client`, `photoCredit`. Facts you leave out are simply not shown.
   - `cover` (the `-01.jpg` path) and `images`: one entry per photo with `src`, `thumb` (the `-1200` file),
     `width` and `height` (of the **full-size** file, in pixels) and `alt`.
   - Order matters: the Projects page keeps the order of this file, so put new completed work near the top.
4. **Blur placeholders.** Run `pnpm content:blur` (Node 22.18 or newer). It rewrites `src/content/blur.json`.
5. **Check.** Run `pnpm test`: it verifies every file you listed exists, slugs are unique and every image has a
   blur placeholder. Then `pnpm dev` and open `/en/projects/<slug>`.

To feature a project on Home, put its slug in `FEATURED_SLUGS` (top of `projects.ts`).

### Alt text

Describe what is visible in one sentence, without "image of". The current alt text is a generic "Project, photo
NN"; replacing it with real descriptions is a worthwhile accessibility improvement.

## Adding or replacing a 3D model

A project shows **Explore in 3D** only when it has a `modelUrl`.

### Conventions the viewer relies on

- Format: `.glb`. **Y up, metres.** Front façade faces **+Z**, building centred on the origin, ground at y = 0.
- Top-level nodes, named exactly: `site` (ground plate), `floor-0`, `floor-1` … `floor-N` (one per storey,
  bottom to top) and `roof` (roof slab, parapets, frames, pergolas).
- Glass materials must be transparent (`alphaMode: BLEND`). Everything else is matte PBR. No textures are needed.
- "Explode floors" moves `floor-k` up by `k × 2.4 m` and `roof` by `(N + 1) × 2.4 m`.
- The viewer adds the orange edge lines, shadows, lighting and the camera framing itself.

### Steps

1. Put the model in `public/models/<slug>.glb`.
2. In the project entry add:

   ```ts
   modelUrl: "/models/<slug>.glb",
   modelFloors: 3,
   hotspots: [
     { id: "entrance", label: "Lobby entrance", position: [0, 2.5, 11.3], floor: 0, photo: 2 },
   ],
   ```

   - `position` is in **model space** (metres). Place it on the surface you want to point at.
   - `floor` is the storey the hotspot belongs to (a number, or `"roof"`), so it moves with that floor when exploded.
   - `photo` is the **1-based** gallery photo it opens (so it must be ≤ the number of images).

3. Run `pnpm test`.

### Replacing a massing model with a real SketchUp / Revit / Blender export

1. Export to `.glb` in metres, Y up. Rename the top-level groups to `site`, `floor-0` … `floor-N` and `roof`.
   Front façade towards +Z; origin at the centre of the footprint, ground at y = 0.
2. Compress it:

   ```bash
   npx @gltf-transform/cli optimize house.glb public/models/<slug>.glb --compress draco
   # or: --compress meshopt
   ```

   Aim for under a few MB. Draco decoders are self-hosted in `public/draco/`.

3. Re-check the hotspot `position`s: a real model rarely matches the old massing model's coordinates.

## Team

Edit `src/content/team.ts`. Portraits are 1600×2000 in `public/team/`: `<name>.jpg` (colour) and
`<name>-bw.jpg` (black and white; the site uses `photo`). Members without a `photo` get an initials tile with
"Photo coming soon". A role containing "TBC" is hidden. Run `pnpm content:blur` after adding portraits.

## Journal

Create `content/journal/<slug>.mdx` with frontmatter `title`, `date` (YYYY-MM-DD), `category`
(Site update | Design | Handover | News), `excerpt`, `cover` (a path under `/public`, e.g. a project's `-1200.jpg`)
and `author`; optionally `title_bn`, `excerpt_bn`. Set `review: true` on drafts that still need approval. Bodies
are English and shared by both languages. Run `pnpm content:blur` if the cover is a new file.

## Translations

Edit `messages/bn.json` alongside `messages/en.json` (a unit test fails if their keys differ). Project text
(summary, scope, location) is currently English only; Bangla pages show it with a short note. Add a `titleBn` to
give a project a Bangla title.

## Home hero slides

The four hero slides are listed in `src/content/hero.ts`; assets are in `public/hero/`. Captions (title, location, scope,
status) come from the project, so set `projectSlug` to an existing project.

To add or replace a slide:

1. **Image.** A 16:9 photo at **2400×1350** (`<id>.jpg`) plus a **1280×720** copy (`<id>-1280.jpg`) for phones and slow
   connections.
2. **Depth map** (`<id>-depth.png`). This is an **offline step**: generate it with any monocular depth model (for example
   Depth Anything V2 small), normalise it to 0–255 with **white = near, black = far**, blur it with a **2–3 px** radius, and
   save it as a **1200×675** greyscale PNG.
3. **Data.** Add a `slide(id, projectSlug, focusX, focusXMobile, focusY, zoom)` line:
   - `focusX` / `focusXMobile`: horizontal focus 0–1 on landscape / portrait screens (0 = left edge, 1 = right edge)
   - `focusY`: vertical focus 0–1, `zoom`: 1.0–1.06 base zoom
4. Run `pnpm content:blur`, then `pnpm test` (it checks the files exist and the focus values are within 0–1).
5. Check on a wide screen and a phone that the subject stays visible: that is what the focus values are for.

Keep the slideshow to a handful of slides: the others are preloaded in the background.

## The Home "what we do" sequence

The dark section on Home shows four frames, one per phase: `public/what-we-do/plan.svg` (Plan), then
photos from Samriddhi (Design render), Dr Arafat Palace (Engineer, with an orange structural grid drawn
over it) and Windsor Hotel (Build, completed). They are stand-ins taken from different projects, listed in
`src/content/what-we-do.ts`.

**When real plans and site photos exist for one project, replace these four frames with that single
project's real journey:** its plan drawing, its 3D render, a structural drawing or photo, and its
completed photo. Edit `WHAT_WE_DO_FRAMES` (image path, `projectSlug`). If you replace the plan, keep the
named groups `walls`, `openings`, `glazing`, `grid`, `columns`, `dims`, then regenerate
`src/content/plan-markup.ts` from the new SVG (the draw-in animation targets those group ids).
