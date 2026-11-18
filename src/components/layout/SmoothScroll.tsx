"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/lenis";

/**
 * Lenis smooth-scroll provider. Lenis is imported after hydration so it never blocks the
 * first render, and it is disabled entirely for users who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let cancelled = false;

    const start = async () => {
      if (lenis) return;
      const { default: LenisClass } = await import("lenis");
      if (cancelled || lenis || query.matches) return;
      lenis = new LenisClass({ autoRaf: true, anchors: true, lerp: 0.1 });
      setLenis(lenis);
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
    const sync = () => (query.matches ? stop() : void start());

    sync();
    query.addEventListener("change", sync);
    return () => {
      cancelled = true;
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
