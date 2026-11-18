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
