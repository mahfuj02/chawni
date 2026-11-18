import { PROJECT_CATEGORIES, JOURNAL_CATEGORIES } from "@/content/types";
import type { JournalCategory, ProjectCategory } from "@/content/types";

/** Parse `?category=` into a valid project category, or undefined for "All". */
export function parseProjectCategory(
  value: string | string[] | undefined,
): ProjectCategory | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return PROJECT_CATEGORIES.find((c) => c === v);
}

/** Journal category slugs in the URL are lowercase, hyphenated: "site-update". */
export function journalCategoryToSlug(category: JournalCategory) {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function parseJournalCategory(
  value: string | string[] | undefined,
): JournalCategory | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return JOURNAL_CATEGORIES.find((c) => journalCategoryToSlug(c) === v);
}

export function filterByCategory<T extends { category: string }>(
  items: T[],
  category?: string,
): T[] {
  return category ? items.filter((i) => i.category === category) : items;
}

/** Positive integer from a query param, falling back to `fallback`. */
export function parsePositiveInt(value: string | string[] | undefined, fallback = 1) {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: current, totalPages };
}
