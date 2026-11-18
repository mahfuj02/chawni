import type { Localized } from "@/lib/localized";

export type ProjectCategory = "residential" | "commercial" | "interior" | "construction";
export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "residential",
  "commercial",
  "interior",
  "construction",
];

export type PhaseKey = "plan" | "design" | "engineer" | "build";

export interface ImageRef {
  /** Path under /public. Leave empty while the photo is a placeholder. */
  src?: string;
  /** Uppercase hint shown on the placeholder, e.g. "HOUSE EXTERIOR". */
  caption: string;
  alt: Localized;
}

export interface Project {
  slug: string;
  title: Localized;
  category: ProjectCategory;
  location: Localized;
  client: Localized;
  year: number;
  /** Built-up area in square feet. */
  sizeSqft: number;
  scope: Localized;
  status: "completed" | "ongoing";
  summary: Localized;
  brief: Localized;
  solution: Localized;
  hero: ImageRef;
  /** Six gallery images. */
  gallery: ImageRef[];
  quote: { text: Localized; author: Localized };
  /** GLB path (e.g. "/models/house.glb"). When absent the procedural demo model is shown. */
  modelUrl?: string;
  featured: boolean;
}

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

export interface TeamLeader {
  id: string;
  name: Localized;
  role: Localized;
  qualification: Localized;
  photo?: ImageRef;
}

export interface Client {
  name: string;
  /** Logo path under /public. Placeholder wordmark is shown while empty. */
  logo?: string;
}

export interface Testimonial {
  quote: Localized;
  author: Localized;
  role: Localized;
  organization: Localized;
}

export type JournalCategory = "Site update" | "Design" | "Handover" | "News";
export const JOURNAL_CATEGORIES: JournalCategory[] = ["Site update", "Design", "Handover", "News"];

export interface JournalPost {
  slug: string;
  title: Localized;
  date: string;
  category: JournalCategory;
  excerpt: Localized;
  cover: string;
  author: string;
  /** Raw MDX body (English; shared by both locales). */
  body: string;
}
