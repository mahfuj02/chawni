"use client";

import { useEffect, useRef, useState } from "react";
import {
  introLoadTimeout,
  markIntroSeen,
  readIntroEnv,
  setIntroPlaying,
  shouldPlayIntro,
} from "@/lib/intro-gate";
import type { IntroHandle } from "./logo-intro-scene";

/**
 * 3D logo intro, Home page, first visit per session.
 *
 * The server renders this layer as a plain dark div that CSS only shows while `<html data-intro="playing">`
 * (set before first paint by a tiny inline script), so there is no flash of the hero first. three.js and the
 * scene live in a separate chunk that is imported here; the hero's LCP image never waits for it. If the chunk
 * has not arrived within 1.2 s the intro is skipped. The hero reads the same attribute to hold its entrance
 * animation and slideshow clock until the intro has finished.
 */
export function LogoIntro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);
  const [ready, setReady] = useState(false);
  const layer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<IntroHandle | null>(null);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!shouldPlayIntro(readIntroEnv())) {
      // Not playing: clear the pre-paint marker (the layer itself stays display:none).
      setIntroPlaying(false);
      return;
    }
    setIntroPlaying(true);

    let cancelled = false;
    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      markIntroSeen();
      // Hand focus back to the page if it was on the skip button.
      if (layer.current?.contains(document.activeElement)) {
        document.getElementById("main")?.focus({ preventScroll: true });
      }
      document.documentElement.style.removeProperty("--reveal-scale");
      setIntroPlaying(false);
      setGone(true);
    };
    const timer = window.setTimeout(end, introLoadTimeout());

    skipRef.current = () => (handle.current ? handle.current.finish() : end());
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" && e.key !== "Enter" && e.key !== " ") return;
      // Space/Enter on a focused control keeps its normal meaning; only the bare page skips.
      if (e.key !== "Escape" && e.target !== document.body && e.target !== skipEl()) return;
      skipRef.current();
    };
    const skipEl = () => layer.current?.querySelector("button") ?? null;
    window.addEventListener("keydown", onKey);

    import("./logo-intro-scene")
      .then((m) => {
        if (cancelled || ended) return;
        window.clearTimeout(timer);
        const l = layer.current;
        const s = stage.current;
        if (!l || !s) return end();
        const h = m.startLogoIntro(l, s, {
          onReveal: (k) =>
            document.documentElement.style.setProperty("--reveal-scale", String(1.08 - 0.08 * k)),
          onDone: end,
        });
        if (!h) return end();
        handle.current = h;
        setReady(true);
      })
      .catch(end);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      handle.current?.destroy();
      handle.current = null;
      document.documentElement.style.removeProperty("--reveal-scale");
      setIntroPlaying(false);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={layer} data-intro-layer className="intro-layer">
      <div ref={stage} aria-hidden="true" className="absolute inset-0" />
      {ready && (
        <button type="button" className="intro-skip" onClick={() => skipRef.current()}>
          {skipLabel}
        </button>
      )}
    </div>
  );
}
