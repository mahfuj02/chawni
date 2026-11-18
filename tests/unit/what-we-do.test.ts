import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PLAN_MARKUP } from "@/content/plan-markup";
import { projects } from "@/content/projects";
import { WHAT_WE_DO_FRAMES } from "@/content/what-we-do";

describe("what-we-do frames", () => {
  it("has one frame per phase, in order", () => {
    expect(WHAT_WE_DO_FRAMES.map((f) => f.phase)).toEqual(["plan", "design", "engineer", "build"]);
  });
  it("every frame image exists in /public", () => {
    for (const f of WHAT_WE_DO_FRAMES) {
      expect(existsSync(join(process.cwd(), "public", f.image)), f.image).toBe(true);
    }
  });
  it("project frames point at real projects", () => {
    for (const f of WHAT_WE_DO_FRAMES.filter((x) => x.projectSlug)) {
      expect(
        projects.some((p) => p.slug === f.projectSlug),
        f.projectSlug,
      ).toBe(true);
    }
  });
  it("the inlined plan has the named groups the animation targets", () => {
    for (const id of ["walls", "openings", "glazing", "grid", "columns", "dims"]) {
      expect(PLAN_MARKUP).toContain(`id="${id}"`);
    }
    expect(PLAN_MARKUP).toContain('pathLength="1"');
  });
});
