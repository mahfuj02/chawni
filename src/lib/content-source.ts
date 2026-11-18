import "server-only";
import {
  FEATURED_SLUGS,
  clients,
  company,
  disciplines,
  phases,
  projects,
  sectors,
  stats,
  team,
  testimonials,
} from "@/content";
import type {
  Client,
  JournalPost,
  Phase,
  Project,
  ProjectCardData,
  ProjectCategory,
  ProjectImage,
  Sector,
  StatItem,
  TeamMemberCardData,
  Testimonial,
} from "@/content/types";
import { getBlur } from "@/lib/blur";
import type { Localized } from "@/lib/localized";
import { readPosts } from "@/lib/mdx";

/**
 * Everything the pages need from the content layer. The default implementation reads
 * typed files in src/content and MDX in content/journal. To move to a headless CMS
 * (e.g. Sanity) implement this same interface and return it from getContentSource().
 *
 * Image blur placeholders are attached here, on the server, so client components only ever
 * receive the few hundred bytes they actually display.
 */
export interface ContentSource {
  getCompany(): Promise<typeof company>;
  getStats(): Promise<StatItem[]>;
  getPhases(): Promise<Phase[]>;
  getSectors(): Promise<Sector[]>;
  /** Slim data for listing cards, in the order of the data file. */
  getProjectCards(filter?: { category?: ProjectCategory }): Promise<ProjectCardData[]>;
  getFeaturedProjects(): Promise<ProjectCardData[]>;
  /** Every project (without blur data). Used for static params, sitemap and metadata. */
  getProjects(): Promise<Project[]>;
  /** One project with blur placeholders on every image. */
  getProject(slug: string): Promise<Project | undefined>;
  /** The next project in list order, wrapping around to the first. */
  getNextProject(slug: string): Promise<ProjectCardData | undefined>;
  getTeam(): Promise<TeamMemberCardData[]>;
  getDisciplines(): Promise<Localized[]>;
  getClients(): Promise<Client[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getPosts(): Promise<JournalPost[]>;
  getPost(slug: string): Promise<JournalPost | undefined>;
  getRelatedPosts(slug: string, limit?: number): Promise<JournalPost[]>;
}

const withBlur = (image: ProjectImage): ProjectImage => ({ ...image, blur: getBlur(image.thumb) });

function toCard(p: Project): ProjectCardData {
  const cover = p.images.find((i) => i.src === p.cover) ?? p.images[0];
  return {
    slug: p.slug,
    title: p.title,
    titleBn: p.titleBn,
    category: p.category,
    status: p.status,
    location: p.location,
    year: p.year,
    cover: withBlur(cover),
  };
}

export const localContentSource: ContentSource = {
  async getCompany() {
    return company;
  },
  async getStats() {
    return stats;
  },
  async getPhases() {
    return phases;
  },
  async getSectors() {
    return sectors;
  },
  async getProjectCards(filter) {
    const list = filter?.category
      ? projects.filter((p) => p.category === filter.category)
      : projects;
    return list.map(toCard);
  },
  async getFeaturedProjects() {
    return FEATURED_SLUGS.flatMap((slug) => {
      const p = projects.find((x) => x.slug === slug);
      return p ? [toCard(p)] : [];
    });
  },
  async getProjects() {
    return projects;
  },
  async getProject(slug) {
    const p = projects.find((x) => x.slug === slug);
    return p ? { ...p, images: p.images.map(withBlur) } : undefined;
  },
  async getNextProject(slug) {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i === -1) return undefined;
    return toCard(projects[(i + 1) % projects.length]);
  },
  async getTeam() {
    return team.map((m) => ({ ...m, photoBlur: getBlur(m.photo) }));
  },
  async getDisciplines() {
    return disciplines;
  },
  async getClients() {
    return clients;
  },
  async getTestimonials() {
    return testimonials;
  },
  async getPosts() {
    return readPosts();
  },
  async getPost(slug) {
    return (await readPosts()).find((p) => p.slug === slug);
  },
  async getRelatedPosts(slug, limit = 3) {
    const all = await readPosts();
    const current = all.find((p) => p.slug === slug);
    const others = all.filter((p) => p.slug !== slug);
    // Same category first, then the rest by date.
    const same = others.filter((p) => p.category === current?.category);
    const rest = others.filter((p) => p.category !== current?.category);
    return [...same, ...rest].slice(0, limit);
  },
};

export function getContentSource(): ContentSource {
  return localContentSource;
}
