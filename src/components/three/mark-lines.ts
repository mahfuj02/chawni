/**
 * The Chawni mark as single-weight polylines (SVG space 850 x 800, stroke 19, miter joins).
 * Identical to the lines in public/brand/chawni-icon-dark.svg. Do not edit.
 */
export const MARK_LINES: [number, number][][] = [
  [
    [285, 635],
    [285, 320],
    [150, 185],
    [55, 270],
    [55, 525],
  ],
  [
    [55, 525],
    [140, 440],
  ],
  [
    [100, 335],
    [225, 470],
    [60, 635],
    [155, 728],
  ],
  [
    [300, 45],
    [232, 100],
    [405, 265],
    [405, 505],
    [480, 412],
    [545, 470],
    [385, 635],
    [320, 560],
  ],
  [
    [500, 45],
    [427, 105],
    [580, 255],
    [580, 635],
  ],
  [
    [560, 45],
    [800, 270],
    [800, 665],
  ],
  [
    [800, 470],
    [745, 415],
    [635, 510],
    [725, 600],
  ],
];

/** Orange tag polygon below the mark. */
export const TAG_POLYGON: [number, number][] = [
  [210, 700],
  [805, 700],
  [805, 800],
  [300, 800],
];

export const MARK_WIDTH = 850;
export const MARK_HEIGHT = 800;
export const STROKE = 19;

export const BRAND = {
  orange: "#F47C24",
  ink: "#141414",
  sky: "#AECBE8",
} as const;
