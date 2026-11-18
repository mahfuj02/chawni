"use client";

import { Pause, Play } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/components/three/useSceneGate";
import { Link } from "@/i18n/navigation";
import { INTRO_EVENT, isIntroPlaying } from "@/lib/intro-gate";
import { cn } from "@/lib/utils";
import { SLIDE_MS, type GLSlide, type HeroSync } from "./hero-gl";

// The WebGL layer is loaded on demand, after the page has painted and the browser is idle.
const HeroGL = dynamic(() => import("./HeroGL"), { ssr: false });

export interface HeroCaption {
  title: string;
  /** "location · scope · status" */
  meta: string;
  href: string;
  alt: string;
  /** Static image details, for slides after the first (the first is rendered by the server). */
  image: string;
  blur?: string;
  /** CSS object-position pieces, as percentages. */
  fx: number;
  fxMobile: number;
  fy: number;
}

export interface HeroLabels {
  choose: string;
  /** "Show {title}" */
  show: string;
  pause: string;
  play: string;
  scroll: string;
}

interface HeroSlideshowProps {
  slides: GLSlide[];
  captions: HeroCaption[];
  labels: HeroLabels;
  /** Server-rendered first slide (the LCP element). */
  firstImage: ReactNode;
  /** Server-rendered copy block (eyebrow, headline, text, buttons). */
  copy: ReactNode;
}

const pos = (c: HeroCaption) =>
  ({
    "--fx": `${c.fx * 100}%`,
    "--fxm": `${c.fxMobile * 100}%`,
    "--fy": `${c.fy * 100}%`,
  }) as React.CSSProperties;

function subscribeIntro(cb: () => void) {
  window.addEventListener(INTRO_EVENT, cb);
  return () => window.removeEventListener(INTRO_EVENT, cb);
}

export function HeroSlideshow({ slides, captions, labels, firstImage, copy }: HeroSlideshowProps) {
  const count = slides.length;
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  // While the logo intro plays, the slideshow clock and the WebGL start wait (the CSS holds the entrance).
  const introPlaying = useSyncExternalStore(subscribeIntro, isIntroPlaying, () => false);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [mountGL, setMountGL] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [glFailed, setGlFailed] = useState(false);

  const section = useRef<HTMLElement>(null);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const sync = useRef<HeroSync>({ index: 0, elapsed: 0 });

  const paused = userPaused || hover || focusIn;
  const autoRun = !reduce && !paused && inView && !tabHidden && !introPlaying;

  const go = useCallback(
    (i: number) => {
      const next = (i + count) % count;
      setIndex(next);
      setVisited((v) => (v.includes(next) ? v : [...v, next]));
    },
    [count],
  );

  // New slide: tell the renderer, restart the clock, reset the progress bars.
  useEffect(() => {
    sync.current.index = index;
    sync.current.elapsed = 0;
    bars.current.forEach((b, i) => {
      if (b) b.style.width = i === index && reduce ? "100%" : "0%";
    });
  }, [index, reduce]);

  // Auto-advance clock. Time only counts while running, so pausing keeps the remaining time.
  useEffect(() => {
    if (!autoRun) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      sync.current.elapsed += Math.min(now - last, 100);
      last = now;
      const bar = bars.current[index];
      if (bar) bar.style.width = `${Math.min(100, (sync.current.elapsed / SLIDE_MS) * 100)}%`;
      if (sync.current.elapsed >= SLIDE_MS) {
        go(index + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRun, index, go]);

  // Visibility: pause rendering and the clock off screen and in background tabs.
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Mount the WebGL layer when the browser is idle, but only once the page has settled: on the first
  // interaction, or after 4 s, whichever comes first. This keeps texture decoding and shader compilation
  // out of the start-up window (TBT) without making real visitors wait for the effect. Never for reduced motion.
  useEffect(() => {
    if (reduce || introPlaying) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const events = [
      "pointerdown",
      "pointermove",
      "wheel",
      "keydown",
      "touchstart",
      "scroll",
    ] as const;
    let idle = 0;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      cleanupListeners();
      if (w.requestIdleCallback)
        idle = w.requestIdleCallback(() => setMountGL(true), { timeout: 1000 });
      else idle = window.setTimeout(() => setMountGL(true), 1000);
    };
    const timer = window.setTimeout(start, 4000);
    function cleanupListeners() {
      events.forEach((e) => window.removeEventListener(e, start));
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    return () => {
      window.clearTimeout(timer);
      cleanupListeners();
      if (idle) {
        if (w.cancelIdleCallback) w.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
    };
  }, [reduce, introPlaying]);

  const onDotKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + count) % count;
    go(next);
    dots.current[next]?.focus();
  };

  const showGL = mountGL && !glFailed && !reduce;

  return (
    <section
      ref={section}
      data-hero
      aria-label="Chawni Architectures"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocusIn(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocusIn(false);
      }}
      className="relative isolate flex min-h-[max(100svh,560px)] flex-col overflow-hidden bg-[#141414] text-white"
    >
      {/* Static layer: always works, and is the LCP element. Hidden once the canvas has faded in. */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 bottom-[2px] z-0 transition-[visibility] delay-[900ms] duration-0",
          glReady && showGL && "invisible",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 motion-reduce:duration-0",
            index === 0 ? "opacity-100" : "opacity-0",
          )}
        >
          {firstImage}
        </div>
        {visited
          .filter((i) => i > 0)
          .map((i) => (
            <div
              key={i}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 motion-reduce:duration-0",
                index === i ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={captions[i].image}
                alt={captions[i].alt}
                fill
                sizes="100vw"
                placeholder={captions[i].blur ? "blur" : "empty"}
                blurDataURL={captions[i].blur}
                className="hero-img object-cover"
                style={pos(captions[i])}
              />
            </div>
          ))}
      </div>

      {showGL && (
        <HeroGL
          slides={slides}
          sync={sync}
          active={inView && !tabHidden}
          onReady={() => setGlReady(true)}
          onFail={() => setGlFailed(true)}
          className={cn(
            "absolute inset-0 z-[1] size-full transition-opacity duration-[800ms]",
            glReady ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Shade: above the static image and the canvas, below the copy. Never intercepts the pointer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]">
        <div className="hero-shade-left absolute inset-0" />
        <div className="hero-shade-bottom absolute inset-0" />
        <div className="hero-shade-top absolute inset-0" />
        <div className="hero-shade-mobile absolute inset-0" />
      </div>

      {copy}

      <div className="absolute right-[clamp(20px,5vw,72px)] bottom-7 left-[clamp(20px,5vw,72px)] z-10 flex flex-wrap items-end justify-between gap-[18px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Arrow keys move between slides; the buttons inside remain the real controls. */}
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            role="group"
            aria-label={labels.choose}
            onKeyDown={onDotKey}
            className="flex gap-2.5"
          >
            {captions.map((c, i) => (
              <button
                key={c.href}
                ref={(el) => {
                  dots.current[i] = el;
                }}
                type="button"
                aria-label={labels.show.replace("{title}", c.title)}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className="relative h-11 w-16 cursor-pointer"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/30"
                />
                <span
                  aria-hidden="true"
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  className="absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 bg-orange"
                />
              </button>
            ))}
          </div>
          {!reduce && (
            <button
              type="button"
              aria-pressed={userPaused}
              onClick={() => setUserPaused((p) => !p)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[0.8125rem] font-semibold tracking-wide text-white/90 hover:text-white"
            >
              {userPaused ? (
                <Play aria-hidden="true" className="size-4" />
              ) : (
                <Pause aria-hidden="true" className="size-4" />
              )}
              {userPaused ? labels.play : labels.pause}
            </button>
          )}
        </div>

        <span
          aria-hidden="true"
          className="hidden text-[11px] tracking-[0.3em] text-[#C4C8CC] md:block"
        >
          {labels.scroll}
        </span>

        <p
          aria-live="polite"
          className="hidden min-h-10 pe-16 text-right text-[13px] leading-normal text-[#E6E8EB] md:block"
        >
          <Link href={captions[index].href} className="block hover:underline">
            <b className="block font-heading text-base font-semibold text-white">
              {captions[index].title}
            </b>
            {captions[index].meta}
          </Link>
        </p>
      </div>
    </section>
  );
}
