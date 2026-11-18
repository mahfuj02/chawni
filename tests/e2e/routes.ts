import fs from "node:fs";
import path from "node:path";
import { projects } from "../../src/content/projects";

export const LOCALES = ["en", "bn"] as const;

const journalSlugs = fs
  .readdirSync(path.join(process.cwd(), "content", "journal"))
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

/** Every public route, without the locale prefix. */
export const ROUTES: string[] = [
  "/",
  "/about",
  "/services",
  "/projects",
  "/projects/courtyard-house",
  "/journal",
  `/journal/${journalSlugs[0]}`,
  "/contact",
  "/privacy",
];

export const ALL_PROJECT_SLUGS = projects.map((p) => p.slug);
export const ALL_JOURNAL_SLUGS = journalSlugs;

export function withLocale(locale: string, route: string) {
  return `/${locale}${route === "/" ? "" : route}`;
}
