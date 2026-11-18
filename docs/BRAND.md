# Brand

## Logo

Files in `public/brand/` (source in `brand/`). **Never redraw or alter them.**

- `chawni-logo-dark-on-light.svg` — white / light backgrounds
- `chawni-logo-light-on-dark.svg` — sky blue, dark or photo backgrounds
- `*-compact.svg` — without the "architects & engineers" line, used in the header
- `chawni-mark-*.svg` mark + orange Bangla tag; `chawni-icon-*.svg` mark only
- `favicon.svg`, `apple-touch-icon.png`, `icon-512.png`

Rules: orange `#F47C24` never changes; parts that are white on dark become ink `#141414` on light.
Clear space = height of the orange tag. Minimum header width 120px. Use the `Logo` component.

## Colour

| Token                 | Hex       | Use                                              |
| --------------------- | --------- | ------------------------------------------------ |
| `--color-orange`      | `#F47C24` | Accent: buttons, markers, rules. Never body text |
| `--color-orange-text` | `#C2560E` | Small orange labels on white                     |
| `--color-ink`         | `#141414` | Text, dark sections, text on orange              |
| `--color-white`       | `#FFFFFF` | Page base                                        |
| `--color-sky`         | `#AECBE8` | Hero, soft panels                                |
| `--color-mist`        | `#F5F7F9` | Soft sections                                    |
| `--color-line`        | `#E4E6E9` | Borders                                          |
| `--color-muted`       | `#5C6066` | Secondary text                                   |
| `--color-dark-2`      | `#1E2124` | Panels inside dark sections                      |

Text on orange is always ink, never white.

## Type

Sora 600 headings (−0.02 to −0.03em); Inter 400/500/600 body; Hind Siliguri for Bangla.
Fluid scale: display 46→86px, h2 36→64px, h3 24px, body 17–18px, small 14px, label 12–14px.

## Spacing and shape

Section padding 80–130px desktop, 64px mobile. Max width 1440px; side padding 20px → 72px.
4px radius on cards and images; pill buttons (primary orange, dark, outline).

## Motion

Subtle: fade-up 16px / 0.6s, counters on view, image reveal. Disabled under `prefers-reduced-motion`.

## Brand rules (audited for v0.4.0)

These are checked page by page, in en and bn, at 390, 768 and 1440px.

- **Logo:** orange `#F47C24` never changes. Light logo on dark, photo or sky backgrounds; dark logo on white or light ones. Clear space is at least the tag height. No stretched, recoloured or redrawn versions.
- **Header:** transparent with the light logo only over the Home hero (it turns white with the dark logo after 80% of the hero); white with the dark logo everywhere else.
- **Orange:** an accent only (buttons, markers, numbers, rules, the underline highlight). Text on orange is ink `#141414`, never white. Orange text or numerals on white or mist use the `orange-text` token (it is a touch darker than `#C2560E`, `#B8510C`, so it still passes 4.5:1 on the mist background); plain `#F47C24` is only for text on dark backgrounds.
- **Text contrast:** body is ink, secondary text is `#5C6066` or darker. All text meets 4.5:1 (3:1 at 24px and up).
- **Type:** Sora for headings and numbers, Inter for body, Hind Siliguri for both in Bangla. Section labels are lowercase with an orange square ("who we are").
- **Shape:** 4px radius on cards and images, pill buttons, 44px minimum touch targets (including breadcrumb and contact links), consistent section padding and max width.
- **Imagery:** real photos everywhere, with no placeholder blocks. Team portraits are black and white at 4:5; members without a photo are listed by name only until one exists. Every image has meaningful alt text, or an empty alt when decorative.
- **Motion:** subtle and purposeful, nothing bouncy, everything respects `prefers-reduced-motion`. Only the hero, the logo intro and the What-we-do sequence use scroll or WebGL effects (plus the project 3D viewer, which the visitor starts).
- **Name:** ছাউনি everywhere in Bangla, including the footer and Bangla project titles. Project and journal text that exists only in English still says "Chawni" until it is translated.
