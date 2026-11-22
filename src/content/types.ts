import type { Localized } from "@/lib/localized";

// ---- Projects -----------------------------------------------------------------------------

export type ProjectStatus =
  "Completed" | "In progress" | "Construction starting" | "Proposed" | "Design";

export type ProjectCategory =
  "Residential" | "Commercial" | "Hospitality" | "Interior" | "Institutional";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "Residential",
  "Commercial",
  "Hospitality",
  "Interior",
  "Institutional",
];

/** URL / translation key for a category: "Residential" -> "residential". */
export type CategorySlug = Lowercase<ProjectCategory>;
export const categorySlug = (c: ProjectCategory) => c.toLowerCase() as CategorySlug;

/** Translation key (under `projectsPage.status`) for each status. */
export const STATUS_KEY = {
  Completed: "completed",
  "In progress": "inProgress",
  "Construction starting": "constructionStarting",
  Proposed: "proposed",
  Design: "design",
} as const satisfies Record<ProjectStatus, string>;

export interface ProjectImage {
  /** Full-size photo (max 2400 px). */
  src: string;
  /** 1200 px web version, used for cards and the gallery grid. */
  thumb: string;
  /** Pixel size of `src`; the aspect ratio is shared by `thumb`. */
  width: number;
  height: number;
  alt: string;
  /** Tiny blur placeholder, added by the content source on the server (see blur.json). */
  blur?: string;
}

export interface ProjectHotspot {
  id: string;
  label: string;
  /** Anchor in model space (metres, Y up). */
  position: [number, number, number];
  /** Storey the hotspot belongs to (so it moves with that floor when exploded), or "roof". */
  floor: number | "roof";
  /** 1-based gallery photo this hotspot opens. */
  photo: number;
}

export interface Project {
  slug: string;
  title: string;
  titleBn?: string;
  category: ProjectCategory;
  scope: string;
  status: ProjectStatus;
  location: string;
  area?: string;
  year?: string;
  client?: string;
  summary: string;
  photoCredit?: string;
  cover: string;
  images: ProjectImage[];
  /** GLB massing model built from the renders (see public/models). Nodes: site, floor-0…floor-N, roof. */
  modelUrl?: string;
  modelFloors?: number;
  hotspots?: ProjectHotspot[];
}

/** The small slice of a project that listing cards need (keeps client payloads light). */
export interface ProjectCardData {
  slug: string;
  title: string;
  titleBn?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  year?: string;
  cover: ProjectImage;
}

// ---- Team ---------------------------------------------------------------------------------

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  /** e.g. "Co-founder" */
  title?: string;
  /** Black-and-white portrait (the site uses this one). */
  photo?: string;
  photoColor?: string;
  initials: string;
}

export interface TeamMemberCardData extends TeamMember {
  photoBlur?: string;
}

// ---- Services, stats, clients -------------------------------------------------------------

export type PhaseKey = "plan" | "design" | "engineer" | "build";

export interface Phase {
  key: PhaseKey;
  number: string;
  title: Localized;
  description: Localized;
  subServices: Localized[];
}

export interface Sector {
  key: string;
  title: Localized;
  description: Localized;
}

export interface StatItem {
  key: string;
  value: number;
  suffix?: string;
  decimals?: number;
  label: Localized;
}

export interface Testimonial {
  quote: Localized;
  author: Localized;
  role: Localized;
  organization: Localized;
}

// ---- Journal ------------------------------------------------------------------------------

export type JournalCategory = "Site update" | "Design" | "Handover" | "News";
export const JOURNAL_CATEGORIES: JournalCategory[] = ["Site update", "Design", "Handover", "News"];

export interface JournalPost {
  slug: string;
  title: Localized;
  date: string;
  category: JournalCategory;
  excerpt: Localized;
  /** Path under /public (starts with "/"). */
  cover: string;
  /** Blur placeholder for the cover (added on the server). */
  coverBlur?: string;
  author: string;
  /** True while the draft still needs the studio's review. */
  review: boolean;
  /** Raw MDX body (English; shared by both locales). */
  body: string;
}
