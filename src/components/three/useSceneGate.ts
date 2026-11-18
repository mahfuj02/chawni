"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { decideSceneMode, hasWebGL, readSceneEnv, type SceneMode } from "./capabilities";

export type GateMode = SceneMode | { mode: "pending" };

const PENDING: GateMode = { mode: "pending" };
let cachedMode: SceneMode | null = null;

/** Inspect the browser once and reuse the answer. */
function getClientMode(): GateMode {
  cachedMode ??= decideSceneMode(readSceneEnv());
  return cachedMode;
}
const subscribeNothing = () => () => {};

/**
 * Capability decision for the 3D scenes. "pending" on the server and during hydration
 * (so markup matches), then the real answer on the client.
 */
export function useSceneMode(): GateMode {
  return useSyncExternalStore(subscribeNothing, getClientMode, () => PENDING);
}

/** Live `matchMedia` value; false on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Shared gate for every 3D scene: capability decision plus viewport tracking, so the heavy
 * chunk is only requested when the scene is near the screen, and rendering pauses off screen.
 */
export function useSceneGate<T extends HTMLElement = HTMLDivElement>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const mode = useSceneMode();
  /** True once the element has been within `rootMargin` of the viewport (never reverts). */
  const [near, setNear] = useState(false);
  /** True while the element is on screen. */
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          nearObserver.disconnect();
        }
      },
      { rootMargin },
    );
    const viewObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    nearObserver.observe(el);
    viewObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      viewObserver.disconnect();
    };
  }, [rootMargin]);

  return { ref, mode, near, inView };
}

/**
 * Lazily checks WebGL support at the moment a scene wants to mount (`wanted` turns true).
 * Returns false until then, so no GL context is created during start-up.
 */
export function useWebGLSupport(wanted: boolean): boolean {
  return useMemo(() => (wanted ? hasWebGL() : false), [wanted]);
}
