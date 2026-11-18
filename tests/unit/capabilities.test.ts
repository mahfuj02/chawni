import { describe, expect, it } from "vitest";
import { decideSceneMode, type SceneEnv } from "@/components/three/capabilities";

const capable: SceneEnv = {
  reducedMotion: false,
  webgl: true,
  hardwareConcurrency: 8,
  saveData: false,
  forced: false,
};

describe("decideSceneMode", () => {
  it("runs 3D on a capable device", () => {
    expect(decideSceneMode(capable)).toEqual({ mode: "ready" });
  });

  it("falls back without WebGL, and cannot be overridden", () => {
    expect(decideSceneMode({ ...capable, webgl: false })).toEqual({
      mode: "static",
      reason: "no-webgl",
      canOverride: false,
    });
  });

  it("falls back for reduced motion", () => {
    expect(decideSceneMode({ ...capable, reducedMotion: true })).toMatchObject({
      mode: "static",
      reason: "reduced-motion",
    });
  });

  it("treats 4 or fewer cores as low power", () => {
    for (const cores of [1, 2, 4]) {
      expect(decideSceneMode({ ...capable, hardwareConcurrency: cores })).toMatchObject({
        mode: "static",
        reason: "low-power",
        canOverride: true,
      });
    }
    expect(decideSceneMode({ ...capable, hardwareConcurrency: 5 })).toEqual({ mode: "ready" });
  });

  it("treats Save-Data as low power", () => {
    expect(decideSceneMode({ ...capable, saveData: true })).toMatchObject({ reason: "low-power" });
  });

  it("lets ?force3d=1 bypass the low-power check only", () => {
    expect(decideSceneMode({ ...capable, hardwareConcurrency: 2, forced: true })).toEqual({
      mode: "ready",
    });
    expect(decideSceneMode({ ...capable, reducedMotion: true, forced: true })).toMatchObject({
      mode: "static",
    });
    expect(decideSceneMode({ ...capable, webgl: false, forced: true })).toMatchObject({
      mode: "static",
    });
  });

  it("checks WebGL before reduced motion", () => {
    expect(decideSceneMode({ ...capable, webgl: false, reducedMotion: true })).toMatchObject({
      reason: "no-webgl",
    });
  });
});
