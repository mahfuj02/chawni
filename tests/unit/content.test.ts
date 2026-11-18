import { describe, expect, it } from "vitest";
import { projects, hasModel, DEMO_MODELS } from "@/content";
import { PROJECT_CATEGORIES } from "@/content/types";
import { pick } from "@/lib/localized";
import { localContentSource as content } from "@/lib/content-source";

describe("dummy content shape", () => {
  it("has 8 projects across all four categories", () => {
    expect(projects).toHaveLength(8);
    for (const c of PROJECT_CATEGORIES) {
      expect(projects.some((p) => p.category === c)).toBe(true);
    }
  });

  it("gives every project a unique slug and six gallery images", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of projects) {
      expect(p.gallery).toHaveLength(6);
      expect(p.title.en && p.title.bn).toBeTruthy();
      expect(p.brief.en && p.brief.bn).toBeTruthy();
    }
  });

  it("has exactly three featured projects for the home page", () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(3);
  });

  it("shows the 3D section for demo models, or only when a modelUrl exists", () => {
    expect(DEMO_MODELS).toBe(true);
    expect(hasModel(projects[0])).toBe(true);
  });
});

describe("pick (Localized)", () => {
  it("returns the requested locale and falls back to English", () => {
    const value = { en: "Hello", bn: "হ্যালো" };
    expect(pick(value, "bn")).toBe("হ্যালো");
    expect(pick(value, "en")).toBe("Hello");
    expect(pick(value, "fr")).toBe("Hello");
  });
});

describe("ContentSource (local implementation)", () => {
  it("filters projects by category", async () => {
    const residential = await content.getProjects({ category: "residential" });
    expect(residential.length).toBeGreaterThan(0);
    expect(residential.every((p) => p.category === "residential")).toBe(true);
    expect(await content.getProjects()).toHaveLength(projects.length);
  });

  it("returns the featured projects, limited", async () => {
    expect(await content.getFeaturedProjects(3)).toHaveLength(3);
    expect(await content.getFeaturedProjects(1)).toHaveLength(1);
  });

  it("finds a project by slug, or undefined", async () => {
    expect((await content.getProject("courtyard-house"))?.title.en).toBe("Courtyard House");
    expect(await content.getProject("does-not-exist")).toBeUndefined();
  });

  it("returns the next project and wraps around at the end", async () => {
    const first = projects[0].slug;
    const last = projects[projects.length - 1].slug;
    expect((await content.getNextProject(first))?.slug).toBe(projects[1].slug);
    expect((await content.getNextProject(last))?.slug).toBe(first);
    expect(await content.getNextProject("nope")).toBeUndefined();
  });

  it("reads six journal posts from MDX, newest first", async () => {
    const posts = await content.getPosts();
    expect(posts).toHaveLength(6);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
    for (const post of posts) {
      expect(post.title.en).toBeTruthy();
      expect(post.title.bn).toBeTruthy();
      expect(post.body.length).toBeGreaterThan(20);
    }
  });

  it("covers all four journal categories", async () => {
    const categories = new Set((await content.getPosts()).map((p) => p.category));
    expect(categories).toEqual(new Set(["Site update", "Design", "Handover", "News"]));
  });

  it("returns related posts without the post itself, same category first", async () => {
    const posts = await content.getPosts();
    const target = posts.find((p) => p.category === "Design")!;
    const related = await content.getRelatedPosts(target.slug, 3);
    expect(related).toHaveLength(3);
    expect(related.some((p) => p.slug === target.slug)).toBe(false);
    expect(related[0].category).toBe("Design");
  });

  it("returns undefined for an unknown post", async () => {
    expect(await content.getPost("nope")).toBeUndefined();
  });
});
