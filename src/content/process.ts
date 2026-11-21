import type { Localized } from "@/lib/localized";
import type { PhaseKey } from "./types";

/**
 * The four stages of the Home "what we do" sequence. All four images show the same building (Hotel
 * Paradise Inn) at the same 4:3 framing, so cross-fading them looks like the building materialising.
 */
export interface ProcessImage {
  phase: PhaseKey;
  /** 1600×1200, under /public. */
  image: string;
  /** 800×600, used on small screens. */
  imageSmall: string;
  alt: Localized;
  caption: Localized;
}

export const PROCESS_PROJECT_SLUG = "hotel-paradise-inn";

export const PROCESS_IMAGES: ProcessImage[] = [
  {
    phase: "plan",
    image: "/what-we-do/plan.jpg",
    imageSmall: "/what-we-do/plan-800.jpg",
    alt: {
      en: "Elevation drawing of Hotel Paradise Inn",
      bn: "হোটেল প্যারাডাইস ইনের এলিভেশন ড্রয়িং",
    },
    caption: { en: "Plan · Elevation drawing", bn: "পরিকল্পনা · এলিভেশন ড্রয়িং" },
  },
  {
    phase: "design",
    image: "/what-we-do/design.jpg",
    imageSmall: "/what-we-do/design-800.jpg",
    alt: {
      en: "White architectural model of Hotel Paradise Inn",
      bn: "হোটেল প্যারাডাইস ইনের সাদা স্থাপত্য মডেল",
    },
    caption: { en: "Design · Massing model", bn: "নকশা · ম্যাসিং মডেল" },
  },
  {
    phase: "engineer",
    image: "/what-we-do/engineer.jpg",
    imageSmall: "/what-we-do/engineer-800.jpg",
    alt: {
      en: "Structural frame of Hotel Paradise Inn with column grid",
      bn: "কলাম গ্রিডসহ হোটেল প্যারাডাইস ইনের কাঠামো",
    },
    caption: { en: "Engineer · Structural frame", bn: "প্রকৌশল · কাঠামো" },
  },
  {
    phase: "build",
    image: "/what-we-do/build.jpg",
    imageSmall: "/what-we-do/build-800.jpg",
    alt: { en: "Hotel Paradise Inn at dusk", bn: "গোধূলিতে হোটেল প্যারাডাইস ইন" },
    caption: { en: "Build · Hotel Paradise Inn", bn: "নির্মাণ · হোটেল প্যারাডাইস ইন" },
  },
];
