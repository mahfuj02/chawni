import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PROCESS_IMAGES, PROCESS_PROJECT_SLUG } from "@/content/process";
import { projects } from "@/content/projects";
import { phaseFromProgress } from "@/lib/process-phase";

describe("phaseFromProgress", () => {
  it("maps progress to the four phases", () => {
    expect(phaseFromProgress(0)).toBe(0);
    expect(phaseFromProgress(0.3)).toBe(1);
    expect(phaseFromProgress(0.6)).toBe(2);
    expect(phaseFromProgress(0.95)).toBe(3);
  });
  it("clamps out-of-range and invalid values", () => {
    expect(phaseFromProgress(-0.2)).toBe(0);
    expect(phaseFromProgress(1)).toBe(3);
    expect(phaseFromProgress(4)).toBe(3);
    expect(phaseFromProgress(Number.NaN)).toBe(0);
  });
});

describe("process images", () => {
  it("has one image per phase, in order", () => {
    expect(PROCESS_IMAGES.map((f) => f.phase)).toEqual(["plan", "design", "engineer", "build"]);
  });
  it("every image file exists and has both languages", () => {
    for (const f of PROCESS_IMAGES) {
      for (const p of [f.image, f.imageSmall]) {
        expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
      }
      expect(f.alt.bn.length).toBeGreaterThan(0);
      expect(f.caption.bn.length).toBeGreaterThan(0);
    }
  });
  it("links to a real project", () => {
    expect(projects.some((p) => p.slug === PROCESS_PROJECT_SLUG)).toBe(true);
  });
});
