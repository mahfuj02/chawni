"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { createHeroRenderer, type GLSlide, type HeroRenderer, type HeroSync } from "./hero-gl";

interface HeroGLProps {
  slides: GLSlide[];
  sync: MutableRefObject<HeroSync>;
  /** Rendering pauses when the hero is off screen or the tab is hidden. */
  active: boolean;
  /** Called once the first slide's textures are uploaded and the canvas can fade in. */
  onReady: () => void;
  /** No WebGL, or the context was lost: the static image stays. */
  onFail: () => void;
  className?: string;
}

/** The depth-parallax layer. Decorative: hidden from assistive tech (the static image carries the alt text). */
export default function HeroGL({ slides, sync, active, onReady, onFail, className }: HeroGLProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<HeroRenderer | null>(null);
  const activeNow = useRef(active);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const r = createHeroRenderer(el, slides, sync.current, onReady, onFail);
    if (!r) {
      onFail();
      return;
    }
    renderer.current = r;
    r.setActive(activeNow.current);
    return () => {
      r.destroy();
      renderer.current = null;
    };
    // The renderer is created once; props that change later are handled below or read from refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeNow.current = active;
    renderer.current?.setActive(active);
  }, [active]);

  return <canvas ref={canvas} aria-hidden="true" className={className} />;
}
