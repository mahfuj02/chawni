import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clients } from "@/content/clients";
import { projects } from "@/content/projects";
import { opticalSize } from "@/lib/optical-size";

const pub = (p: string) => join(process.cwd(), "public", p);

describe("clients data", () => {
  it("has unique slugs", () => {
    expect(new Set(clients.map((c) => c.slug)).size).toBe(clients.length);
  });

  it("every client with a logo has both files in public/clients, and a real aspect", () => {
    for (const c of clients.filter((x) => x.logo)) {
      expect(c.logoMono, c.slug).toBeTruthy();
      expect(c.aspect, c.slug).toBeGreaterThan(0);
      for (const f of [c.logo!, c.logoMono!]) {
        expect(existsSync(pub(f)), f).toBe(true);
        const text = readFileSync(pub(f), "utf8");
        expect(text.startsWith("version https://git-lfs"), `${f} is an LFS pointer`).toBe(false);
        expect(text, f).toMatch(/<svg[\s>]/);
      }
    }
  });

  it("clients without a logo have no logo fields at all", () => {
    for (const c of clients.filter((x) => !x.logo)) {
      expect(c.logoMono, c.slug).toBeNull();
      expect(c.aspect, c.slug).toBeNull();
    }
  });

  it("every projectSlug exists in the projects content", () => {
    for (const c of clients.filter((x) => x.projectSlug)) {
      expect(
        projects.some((p) => p.slug === c.projectSlug),
        c.projectSlug,
      ).toBe(true);
    }
  });

  it("has a Bangla sector for every client", () => {
    for (const c of clients) expect(c.sector.bn.length, c.slug).toBeGreaterThan(0);
  });
});

describe("opticalSize", () => {
  it("gives a square badge and a long wordmark similar visual weight", () => {
    const badge = opticalSize(1);
    const word = opticalSize(3.589);
    expect(badge).toEqual({ width: 72, height: 72 });
    const area = (s: { width: number; height: number }) => s.width * s.height;
    expect(area(word) / area(badge)).toBeGreaterThan(0.6);
    expect(area(word) / area(badge)).toBeLessThan(1.6);
  });

  it("clamps height to 24–72 and width to 180", () => {
    for (const a of [0.2, 1, 1.046, 2.178, 3.589, 7.454, 20]) {
      const { width, height } = opticalSize(a);
      expect(width).toBeLessThanOrEqual(180);
      expect(height).toBeLessThanOrEqual(72);
      expect(Math.abs(width / height - a) / a).toBeLessThan(0.1);
    }
    expect(opticalSize(7.454)).toEqual({ width: 180, height: 24 });
  });
});
