import "server-only";
import {
  clients,
  company,
  disciplines,
  leaders,
  phases,
  projects,
  sectors,
  stats,
  testimonials,
} from "@/content";
import type {
  Client,
  JournalPost,
  Phase,
  Project,
  ProjectCategory,
  Sector,
  StatItem,
  TeamLeader,
  Testimonial,
} from "@/content/types";
import type { Localized } from "@/lib/localized";
import { readPosts } from "@/lib/mdx";

/**
 * Everything the pages need from the content layer. The default implementation reads
 * typed files in src/content and MDX in content/journal. To move to a headless CMS
 * (e.g. Sanity) implement this same interface and return it from getContentSource().
 */
export interface ContentSource {
  getCompany(): Promise<typeof company>;
  getStats(): Promise<StatItem[]>;
  getPhases(): Promise<Phase[]>;
  getSectors(): Promise<Sector[]>;
  getProjects(filter?: { category?: ProjectCategory }): Promise<Project[]>;
  getFeaturedProjects(limit?: number): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  /** The next project in list order, wrapping around to the first. */
  getNextProject(slug: string): Promise<Project | undefined>;
  getLeaders(): Promise<TeamLeader[]>;
  getDisciplines(): Promise<Localized[]>;
  getClients(): Promise<Client[]>;
  getTestimonials(): Promise<Testimonial[]>;
  getPosts(): Promise<JournalPost[]>;
  getPost(slug: string): Promise<JournalPost | undefined>;
  getRelatedPosts(slug: string, limit?: number): Promise<JournalPost[]>;
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
  async getProjects(filter) {
    return filter?.category ? projects.filter((p) => p.category === filter.category) : projects;
  },
  async getFeaturedProjects(limit = 3) {
    return projects.filter((p) => p.featured).slice(0, limit);
  },
  async getProject(slug) {
    return projects.find((p) => p.slug === slug);
  },
  async getNextProject(slug) {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i === -1) return undefined;
    return projects[(i + 1) % projects.length];
  },
  async getLeaders() {
    return leaders;
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
