import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { heroSlides } from "@/content/hero";
import { projects } from "@/content";
import { heroCaption } from "@/lib/hero-caption";

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("hero slide data", () => {
  it("has the four slides in order", () => {
    expect(heroSlides.map((s) => s.id)).toEqual(["paradise", "mosque", "akhalia", "windsor"]);
    expect(heroSlides.map((s) => s.projectSlug)).toEqual([
      "hotel-paradise-inn",
      "two-storey-mosque",
      "duplex-akhalia",
      "windsor-hotel",
    ]);
  });

  it("points every slide at an existing project", () => {
    for (const s of heroSlides) {
      expect(
        projects.some((p) => p.slug === s.projectSlug),
        s.id,
      ).toBe(true);
    }
  });

  it("has all three image files for every slide", () => {
    for (const s of heroSlides) {
      for (const file of [s.image, s.imageSmall, s.depth]) {
        expect(fs.existsSync(publicFile(file)), file).toBe(true);
      }
    }
  });

  it("keeps focus values between 0 and 1 and a sensible zoom", () => {
    for (const s of heroSlides) {
      for (const v of [s.focusX, s.focusXMobile, s.focusY]) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
      expect(s.zoom).toBeGreaterThanOrEqual(1);
      expect(s.zoom).toBeLessThan(1.2);
      expect(s.width / s.height).toBeCloseTo(16 / 9, 2);
    }
  });

  it("keeps the focus values from the approved prototype", () => {
    expect(heroSlides.map((s) => [s.focusX, s.focusXMobile, s.focusY, s.zoom])).toEqual([
      [0.0, 0.56, 0.2, 1.05],
      [0.3, 0.42, 0.5, 1.0],
      [0.75, 0.5, 0.45, 1.04],
      [0.65, 0.62, 0.5, 1.03],
    ]);
  });
});

describe("heroCaption", () => {
  const status = () => "Proposed";

  it("takes the title, location and scope from the project", () => {
    const c = heroCaption(heroSlides[2], projects, "en", status);
    expect(c.title).toBe("Duplex Residence, Akhalia");
    expect(c.meta).toBe("Akhalia, Sylhet · Architecture · Proposed");
    expect(c.href).toBe("/projects/duplex-akhalia");
  });

  it("uses the translated status label it is given", () => {
    const c = heroCaption(heroSlides[0], projects, "bn", () => "প্রস্তাবিত");
    expect(c.meta.endsWith("প্রস্তাবিত")).toBe(true);
  });

  it("uses the Bangla title when the project has one", () => {
    const withBn = [{ ...projects[0], titleBn: "বাংলা শিরোনাম" }];
    const slide = { ...heroSlides[0], projectSlug: projects[0].slug };
    expect(heroCaption(slide, withBn, "bn", status).title).toBe("বাংলা শিরোনাম");
    expect(heroCaption(slide, withBn, "en", status).title).toBe(projects[0].title);
  });

  it("fails loudly for an unknown project", () => {
    expect(() =>
      heroCaption({ ...heroSlides[0], projectSlug: "nope" }, projects, "en", status),
    ).toThrow(/unknown project/);
  });
});
