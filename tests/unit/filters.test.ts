import { describe, expect, it } from "vitest";
import {
  JOURNAL_CATEGORY_KEY,
  filterByCategory,
  journalCategoryToSlug,
  paginate,
  parseJournalCategory,
  parsePositiveInt,
  parseProjectCategory,
} from "@/lib/filters";

describe("parseProjectCategory", () => {
  it("accepts every known category", () => {
    for (const c of ["residential", "commercial", "interior", "construction"]) {
      expect(parseProjectCategory(c)).toBe(c);
    }
  });

  it("returns undefined for unknown, empty or missing values (meaning 'All')", () => {
    expect(parseProjectCategory("hospitality")).toBeUndefined();
    expect(parseProjectCategory("")).toBeUndefined();
    expect(parseProjectCategory(undefined)).toBeUndefined();
  });

  it("uses the first value when the param is repeated", () => {
    expect(parseProjectCategory(["interior", "commercial"])).toBe("interior");
  });

  it("is case sensitive so URLs stay canonical", () => {
    expect(parseProjectCategory("Residential")).toBeUndefined();
  });
});

describe("journal categories", () => {
  it("turns labels into URL slugs", () => {
    expect(journalCategoryToSlug("Site update")).toBe("site-update");
    expect(journalCategoryToSlug("News")).toBe("news");
  });

  it("parses slugs back to labels", () => {
    expect(parseJournalCategory("site-update")).toBe("Site update");
    expect(parseJournalCategory("design")).toBe("Design");
    expect(parseJournalCategory("nope")).toBeUndefined();
  });

  it("has a message key for every category", () => {
    expect(Object.keys(JOURNAL_CATEGORY_KEY).sort()).toEqual(
      ["Design", "Handover", "News", "Site update"].sort(),
    );
  });
});

describe("filterByCategory", () => {
  const items = [
    { id: 1, category: "a" },
    { id: 2, category: "b" },
    { id: 3, category: "a" },
  ];

  it("returns everything when no category is given", () => {
    expect(filterByCategory(items)).toHaveLength(3);
  });

  it("keeps only the matching category", () => {
    expect(filterByCategory(items, "a").map((i) => i.id)).toEqual([1, 3]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterByCategory(items, "z")).toEqual([]);
  });
});

describe("parsePositiveInt", () => {
  it("parses valid numbers", () => {
    expect(parsePositiveInt("3")).toBe(3);
  });
  it("falls back for zero, negatives, junk and missing values", () => {
    expect(parsePositiveInt("0")).toBe(1);
    expect(parsePositiveInt("-2")).toBe(1);
    expect(parsePositiveInt("abc", 5)).toBe(5);
    expect(parsePositiveInt(undefined)).toBe(1);
  });
});

describe("paginate", () => {
  const list = Array.from({ length: 7 }, (_, i) => i + 1);

  it("slices pages", () => {
    expect(paginate(list, 1, 3)).toEqual({ items: [1, 2, 3], page: 1, totalPages: 3 });
    expect(paginate(list, 3, 3).items).toEqual([7]);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(list, 99, 3).page).toBe(3);
    expect(paginate(list, 0, 3).page).toBe(1);
  });

  it("always reports at least one page", () => {
    expect(paginate([], 1, 3)).toEqual({ items: [], page: 1, totalPages: 1 });
  });
});
