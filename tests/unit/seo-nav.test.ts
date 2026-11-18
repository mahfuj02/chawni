import { describe, expect, it } from "vitest";
import { isActive } from "@/lib/nav";
import { absoluteUrl, localizedPath, pageMetadata, SITE_URL } from "@/lib/seo";
import { formatDate, formatNumber } from "@/lib/format";
import { cn, pad2 } from "@/lib/utils";

describe("seo helpers", () => {
  it("builds locale paths", () => {
    expect(localizedPath("en", "/")).toBe("/en");
    expect(localizedPath("bn", "/about")).toBe("/bn/about");
    expect(localizedPath("en", "/projects/x")).toBe("/en/projects/x");
  });

  it("builds absolute URLs from the site URL", () => {
    expect(absoluteUrl("/en")).toBe(`${SITE_URL}/en`);
  });

  it("produces canonical, hreflang alternates and Open Graph data", () => {
    const meta = pageMetadata({
      locale: "bn",
      path: "/projects",
      title: "Projects",
      description: "All projects",
    });
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/bn/projects`);
    expect(meta.alternates?.languages).toMatchObject({
      en: `${SITE_URL}/en/projects`,
      bn: `${SITE_URL}/bn/projects`,
      "x-default": `${SITE_URL}/en/projects`,
    });
    expect(meta.openGraph).toMatchObject({
      title: "Projects | Chawni Architectures",
      locale: "bn_BD",
      type: "website",
    });
  });

  it("marks articles and carries the publish time", () => {
    const meta = pageMetadata({
      locale: "en",
      path: "/journal/a",
      title: "A",
      description: "d",
      type: "article",
      publishedTime: "2025-01-02",
    });
    expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2025-01-02" });
  });
});

describe("nav isActive", () => {
  it("matches home only on the exact root", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/about", "/")).toBe(false);
  });

  it("matches a section and its children", () => {
    expect(isActive("/projects", "/projects")).toBe(true);
    expect(isActive("/projects/courtyard-house", "/projects")).toBe(true);
    expect(isActive("/projectsx", "/projects")).toBe(false);
  });
});

describe("formatting and utils", () => {
  it("formats dates per locale in UTC", () => {
    expect(formatDate("2025-10-14", "en")).toBe("14 Oct 2025");
    expect(formatDate("2025-10-14", "bn")).toMatch(/[০-৯]/);
  });

  it("formats numbers per locale", () => {
    expect(formatNumber(4200, "en")).toBe("4,200");
    expect(formatNumber(4200, "bn")).toMatch(/[০-৯]/);
  });

  it("pads numbers and merges class names", () => {
    expect(pad2(3)).toBe("03");
    expect(pad2(12)).toBe("12");
    expect(cn("p-2", false && "x", "p-4")).toBe("p-4");
  });
});
