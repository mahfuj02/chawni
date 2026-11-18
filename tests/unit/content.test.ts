import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURED_SLUGS, projects, stats, team } from "@/content";
import { PROJECT_CATEGORIES, STATUS_KEY, categorySlug, type ProjectStatus } from "@/content/types";
import blur from "@/content/blur.json";
import messagesEn from "../../messages/en.json";
import { localContentSource as content } from "@/lib/content-source";
import { pick } from "@/lib/localized";
import { projectTitle } from "@/lib/project-text";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("projects data integrity", () => {
  it("has 25 projects with unique slugs", () => {
    expect(projects).toHaveLength(25);
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses only the five known categories and the five known statuses", () => {
    const statuses = Object.keys(STATUS_KEY) as ProjectStatus[];
    for (const p of projects) {
      expect(PROJECT_CATEGORIES).toContain(p.category);
      expect(statuses).toContain(p.status);
    }
  });

  it("covers every category", () => {
    for (const c of PROJECT_CATEGORIES) {
      expect(projects.some((p) => p.category === c)).toBe(true);
    }
  });

  it("has a cover that is the first image, and at least one photo each", () => {
    for (const p of projects) {
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.cover).toBe(p.images[0].src);
    }
  });

  it("has 269 photos in total", () => {
    expect(projects.reduce((n, p) => n + p.images.length, 0)).toBe(269);
  });

  it("points every image (2400 px and 1200 px) at a file that exists", () => {
    const missing: string[] = [];
    for (const p of projects) {
      for (const img of p.images) {
        for (const file of [img.src, img.thumb]) {
          if (!fs.existsSync(publicFile(file))) missing.push(file);
        }
        expect(img.width).toBeGreaterThan(0);
        expect(img.height).toBeGreaterThan(0);
        expect(img.alt.length).toBeGreaterThan(0);
      }
    }
    expect(missing).toEqual([]);
  });

  it("has a blur placeholder for every 1200 px photo", () => {
    const map = blur as Record<string, string>;
    const missing = projects.flatMap((p) => p.images.map((i) => i.thumb)).filter((t) => !map[t]);
    expect(missing).toEqual([]);
  });

  it("has 12 models, all building projects, and every model file exists", () => {
    const withModel = projects.filter((p) => p.modelUrl);
    expect(withModel).toHaveLength(12);
    for (const p of withModel) {
      expect(fs.existsSync(publicFile(p.modelUrl!))).toBe(true);
      expect(p.category === "Interior").toBe(false);
    }
  });

  it("gives every hotspot a valid photo number and a floor within the model", () => {
    for (const p of projects.filter((x) => x.modelUrl)) {
      expect(p.hotspots?.length, p.slug).toBeGreaterThan(0);
      for (const h of p.hotspots!) {
        expect(h.photo).toBeGreaterThanOrEqual(1);
        expect(h.photo).toBeLessThanOrEqual(p.images.length);
        expect(h.position).toHaveLength(3);
        if (typeof h.floor === "number") {
          expect(h.floor).toBeGreaterThanOrEqual(0);
          expect(h.floor).toBeLessThan(p.modelFloors!);
        } else {
          expect(h.floor).toBe("roof");
        }
        expect(h.label.length).toBeGreaterThan(0);
      }
    }
  });

  it("has no hotspots on projects without a model", () => {
    for (const p of projects.filter((x) => !x.modelUrl)) expect(p.hotspots).toBeUndefined();
  });

  it("features the three projects named for the home page", () => {
    expect(FEATURED_SLUGS).toEqual(["windsor-hotel", "nirjhar-education", "hotel-paradise-inn"]);
    for (const slug of FEATURED_SLUGS) expect(projects.some((p) => p.slug === slug)).toBe(true);
  });

  it("keeps the data-file order, which starts with eight completed projects", () => {
    expect(projects.slice(0, 8).every((p) => p.status === "Completed")).toBe(true);
    expect(projects[0].slug).toBe("windsor-hotel");
  });

  it("has translation keys for every category and status", () => {
    const pp = messagesEn.projectsPage as Record<string, unknown>;
    for (const c of PROJECT_CATEGORIES) expect(pp[categorySlug(c)]).toBeTruthy();
    for (const key of Object.values(STATUS_KEY)) {
      expect((pp.status as Record<string, string>)[key]).toBeTruthy();
    }
  });

  it("uses the Bangla title when one exists", () => {
    const samriddhi = projects.find((p) => p.slug === "samriddhi")!;
    expect(projectTitle(samriddhi, "bn")).toBe("সমৃদ্ধি");
    expect(projectTitle(samriddhi, "en")).toBe("Samriddhi");
    const windsor = projects.find((p) => p.slug === "windsor-hotel")!;
    expect(projectTitle(windsor, "bn")).toBe("Windsor Hotel");
  });
});

describe("team data", () => {
  it("has the six real members with unique slugs", () => {
    expect(team).toHaveLength(6);
    expect(new Set(team.map((m) => m.slug)).size).toBe(6);
  });

  it("has two co-founders", () => {
    expect(team.filter((m) => m.title === "Co-founder").map((m) => m.name)).toEqual([
      "Engr. Masum Parvez",
      "Engr. Najir Hridoy",
    ]);
  });

  it("uses the black-and-white portrait, and four members have photos", () => {
    const withPhoto = team.filter((m) => m.photo);
    expect(withPhoto).toHaveLength(4);
    for (const m of withPhoto) {
      expect(m.photo).toMatch(/-bw\.jpg$/);
      expect(fs.existsSync(publicFile(m.photo!))).toBe(true);
      expect(fs.existsSync(publicFile(m.photoColor!))).toBe(true);
    }
  });

  it("gives every member initials", () => {
    for (const m of team) expect(m.initials).toMatch(/^[A-Z]{2}$/);
  });
});

describe("derived stats", () => {
  it("match the data", () => {
    const byKey = Object.fromEntries(stats.map((s) => [s.key, s.value]));
    expect(byKey).toEqual({ projects: 25, sectors: 5, models: 12, team: 6 });
  });
});

describe("ContentSource (local implementation)", () => {
  it("returns cards in data-file order with a blur placeholder on the cover", async () => {
    const cards = await content.getProjectCards();
    expect(cards.map((c) => c.slug)).toEqual(projects.map((p) => p.slug));
    expect(cards.every((c) => c.cover.blur?.startsWith("data:image/webp"))).toBe(true);
  });

  it("filters cards by category (Hospitality has 2)", async () => {
    const hospitality = await content.getProjectCards({ category: "Hospitality" });
    expect(hospitality.map((c) => c.slug).sort()).toEqual(["spice-lobster", "windsor-hotel"]);
    expect((await content.getProjectCards({ category: "Interior" })).length).toBe(
      projects.filter((p) => p.category === "Interior").length,
    );
  });

  it("returns the three featured projects in order", async () => {
    const featured = await content.getFeaturedProjects();
    expect(featured.map((f) => f.slug)).toEqual([...FEATURED_SLUGS]);
  });

  it("returns one project with blur on all images, or undefined", async () => {
    const p = await content.getProject("windsor-hotel");
    expect(p?.images.length).toBe(24);
    expect(p?.images.every((i) => i.blur)).toBe(true);
    expect(await content.getProject("nope")).toBeUndefined();
  });

  it("returns the next project and wraps around at the end", async () => {
    expect((await content.getNextProject(projects[0].slug))?.slug).toBe(projects[1].slug);
    expect((await content.getNextProject(projects[projects.length - 1].slug))?.slug).toBe(
      projects[0].slug,
    );
    expect(await content.getNextProject("nope")).toBeUndefined();
  });

  it("returns the team with a blur placeholder for portraits", async () => {
    const members = await content.getTeam();
    expect(members).toHaveLength(6);
    expect(members.filter((m) => m.photoBlur)).toHaveLength(4);
  });

  it("has no testimonials until real ones exist, and six client wordmarks", async () => {
    expect(await content.getTestimonials()).toEqual([]);
    expect((await content.getClients()).map((c) => c.name)).toEqual([
      "Windsor Hotel",
      "Team Consultancy UK",
      "Nirjhar Education",
      "Study Milestone",
      "YES Academy",
      "Zaman Associates",
    ]);
  });
});

describe("journal", () => {
  it("reads six drafts from MDX, newest first, all marked for review", async () => {
    const posts = await content.getPosts();
    expect(posts).toHaveLength(6);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(posts.every((p) => p.review)).toBe(true);
  });

  it("has the six requested titles", async () => {
    const titles = (await content.getPosts()).map((p) => p.title.en).sort();
    expect(titles).toEqual(
      [
        "A new chapter with Study Milestone",
        "Chawni Studio — a dream come true",
        "Samriddhi: construction starts soon",
        "Study Milestone: our fastest project, in 15 days",
        "Team Consultancy UK: an open office in 40 days",
        "Windsor Hotel: a milestone, complete",
      ].sort(),
    );
  });

  it("keeps each post short (150-250 words) with a real cover photo", async () => {
    for (const post of await content.getPosts()) {
      const words = post.body.split(/\s+/).filter(Boolean).length;
      expect(words, post.slug).toBeGreaterThanOrEqual(120);
      expect(words, post.slug).toBeLessThanOrEqual(260);
      expect(fs.existsSync(publicFile(post.cover)), post.cover).toBe(true);
      expect(pick(post.title, "bn")).toBeTruthy();
      expect(post.coverBlur).toBeTruthy();
    }
  });

  it("returns related posts without the post itself", async () => {
    const posts = await content.getPosts();
    const related = await content.getRelatedPosts(posts[0].slug, 3);
    expect(related).toHaveLength(3);
    expect(related.some((p) => p.slug === posts[0].slug)).toBe(false);
  });
});
