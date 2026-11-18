// Home hero slides. Captions (title, location, scope, status) come from the project, looked up by
// `projectSlug`, so they stay in sync and translated. How to add or replace a slide: docs/CONTENT_GUIDE.md.

export interface HeroSlide {
  id: string;
  projectSlug: string;
  /** 2400×1350, desktop. */
  image: string;
  /** 1280×720, phones and slow connections. */
  imageSmall: string;
  /** 1200×675 greyscale depth map (white = near, black = far), already blurred. */
  depth: string;
  width: number;
  height: number;
  /** Horizontal focus 0–1 on landscape screens. */
  focusX: number;
  /** Horizontal focus 0–1 on portrait screens. */
  focusXMobile: number;
  focusY: number;
  zoom: number;
}

const slide = (
  id: string,
  projectSlug: string,
  focusX: number,
  focusXMobile: number,
  focusY: number,
  zoom: number,
): HeroSlide => ({
  id,
  projectSlug,
  image: `/hero/${id}.jpg`,
  imageSmall: `/hero/${id}-1280.jpg`,
  depth: `/hero/${id}-depth.png`,
  width: 2400,
  height: 1350,
  focusX,
  focusXMobile,
  focusY,
  zoom,
});

export const heroSlides: HeroSlide[] = [
  slide("paradise", "hotel-paradise-inn", 0.0, 0.56, 0.2, 1.05),
  slide("mosque", "two-storey-mosque", 0.3, 0.42, 0.5, 1.0),
  slide("akhalia", "duplex-akhalia", 0.75, 0.5, 0.45, 1.04),
  slide("windsor", "windsor-hotel", 0.65, 0.62, 0.5, 1.03),
];
