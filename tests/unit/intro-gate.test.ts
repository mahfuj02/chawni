import { describe, expect, it } from "vitest";
import {
  INTRO_KEY,
  INTRO_PRE_PAINT_SCRIPT,
  shouldPlayIntro,
  type IntroEnv,
} from "@/lib/intro-gate";

const base: IntroEnv = {
  reducedMotion: false,
  seen: false,
  webdriver: false,
  saveData: false,
  userAgent: "Mozilla/5.0 (Windows NT 10.0) Chrome/130 Safari/537.36",
};

describe("intro gating", () => {
  it("plays on a first visit with no restrictions", () => {
    expect(shouldPlayIntro(base)).toBe(true);
  });
  it("is skipped once seen this session", () => {
    expect(shouldPlayIntro({ ...base, seen: true })).toBe(false);
  });
  it("is skipped for reduced motion", () => {
    expect(shouldPlayIntro({ ...base, reducedMotion: true })).toBe(false);
  });
  it("is skipped under webdriver (tests, Lighthouse)", () => {
    expect(shouldPlayIntro({ ...base, webdriver: true })).toBe(false);
  });
  it("is skipped on Save-Data", () => {
    expect(shouldPlayIntro({ ...base, saveData: true })).toBe(false);
  });
  it("is skipped for bots and Lighthouse user agents", () => {
    for (const ua of ["Googlebot/2.1", "Mozilla/5.0 Chrome-Lighthouse", "HeadlessChrome/130"]) {
      expect(shouldPlayIntro({ ...base, userAgent: ua })).toBe(false);
    }
  });
  it("pre-paint script uses the same session key and the same exclusions", () => {
    expect(INTRO_PRE_PAINT_SCRIPT).toContain(INTRO_KEY);
    for (const word of ["prefers-reduced-motion", "webdriver", "saveData", "lighthouse"]) {
      expect(INTRO_PRE_PAINT_SCRIPT).toContain(word);
    }
  });
});
