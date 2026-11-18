export interface SceneEnv {
  reducedMotion: boolean;
  webgl: boolean;
  hardwareConcurrency: number;
  saveData: boolean;
  /** `?force3d=1` in the URL: skip the low-power check (for testing on weak machines). */
  forced: boolean;
}

export type SceneMode =
  /** Run the 3D scene. */
  | { mode: "ready" }
  /** Show the static fallback. `canOverride` means the user may still ask for 3D explicitly. */
  | { mode: "static"; reason: "reduced-motion" | "no-webgl" | "low-power"; canOverride: boolean };

/**
 * Decide whether the 3D scenes should run. Pure function so it can be unit tested.
 * Low power = 4 or fewer logical cores, or the Save-Data hint.
 */
export function decideSceneMode(env: SceneEnv): SceneMode {
  if (!env.webgl) return { mode: "static", reason: "no-webgl", canOverride: false };
  if (env.reducedMotion) return { mode: "static", reason: "reduced-motion", canOverride: false };
  if (!env.forced && (env.hardwareConcurrency <= 4 || env.saveData)) {
    return { mode: "static", reason: "low-power", canOverride: true };
  }
  return { mode: "ready" };
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Read the real environment (browser only). */
export function readSceneEnv(): SceneEnv {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl: hasWebGL(),
    hardwareConcurrency: nav.hardwareConcurrency ?? 8,
    saveData: Boolean(nav.connection?.saveData),
    forced: new URLSearchParams(window.location.search).get("force3d") === "1",
  };
}
