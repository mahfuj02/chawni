"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Container, SectionLabel } from "@/components/ui";
import { useMediaQuery } from "@/components/three/useSceneGate";
import type { Phase } from "@/content/types";
import { getLenis } from "@/lib/lenis";
import { pick } from "@/lib/localized";
import { phaseFromProgress } from "@/lib/process-phase";
import { cn } from "@/lib/utils";
import { StaticFrame, WhatWeDoStage, type StageImage } from "./WhatWeDoStage";

/** After a chip click, scroll-driven updates are ignored for this long so they cannot fight the click. */
const CLICK_LOCK_MS = 800;

/**
 * Dark "what we do" section. On wide screens one 4:3 frame is sticky beside the four scrolling phase
 * texts; a single `active` phase (0–3) drives the image, caption, badge, chips and text highlight.
 * Below 1024px, or with reduced motion, nothing is sticky or animated: each phase shows its own image.
 */
export function WhatWeDo({
  phases,
  images,
  href,
  badge,
}: {
  phases: Phase[];
  images: StageImage[];
  href: string;
  badge: string;
}) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const pinned = wide && !reduce;
  const t = useTranslations("what");
  const locale = useLocale();

  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lockUntil = useRef(0);

  // Scroll progress through the phase list (the viewport centre travels from its top to its bottom).
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (performance.now() < lockUntil.current) return;
    setActive(phaseFromProgress(p));
  });

  // Start loading all four images once the section is near the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function goTo(i: number, eventTime: number) {
    lockUntil.current = eventTime + CLICK_LOCK_MS;
    setActive(i);
    const el = items.current[i];
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -(innerHeight / 2 - el.offsetHeight / 2), duration: 0.7 });
    } else {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const last = phases.length - 1;
    const from = chipRefs.current.findIndex((b) => b === document.activeElement);
    let to: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") to = from >= last ? 0 : from + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") to = from <= 0 ? last : from - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = last;
    if (to === null) return;
    e.preventDefault();
    chipRefs.current[to]?.focus();
  }

  const chips = (
    <nav aria-label={t("phasesNav")}>
      <ul className="mb-4 flex flex-wrap gap-2">
        {phases.map((p, i) => (
          <li key={p.key}>
            <button
              type="button"
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              onClick={(e) => goTo(i, e.timeStamp)}
              onKeyDown={onKeyDown}
              aria-current={i === active ? "step" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-small font-medium transition-colors",
                i === active
                  ? "border-orange bg-orange text-ink"
                  : "border-white/25 text-white hover:border-white",
              )}
            >
              <span className="tabular-nums">{p.number}</span>
              {pick(p.title, locale)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="what-heading"
      className="on-dark section-y bg-ink text-white"
    >
      <Container>
        <div className="mb-12 flex max-w-3xl flex-col gap-6 lg:mb-16">
          <SectionLabel onDark>{t("label")}</SectionLabel>
          <h2 id="what-heading" className="text-h2">
            {t("heading")}
          </h2>
          <p className="text-white/75">{t("text")}</p>
        </div>

        <div className={cn(pinned && "grid grid-cols-2 gap-16")}>
          {!pinned && <div className="mb-2">{chips}</div>}

          <ol ref={listRef} className={cn(pinned && "col-start-1 row-start-1")}>
            {phases.map((p, i) => (
              <li
                key={p.key}
                ref={(el) => {
                  items.current[i] = el;
                }}
                data-phase={i}
                data-current={i === active}
                className={cn(
                  "flex flex-col justify-center gap-5 border-t border-white/15 py-12 transition-opacity duration-500",
                  pinned ? "min-h-screen" : "min-h-0",
                  pinned && i !== active && "opacity-65",
                )}
              >
                <span className="font-heading text-[clamp(3.5rem,2rem+5vw,6rem)] leading-none font-semibold text-orange">
                  {p.number}
                </span>
                <h3 className="text-h2">{pick(p.title, locale)}</h3>
                <p className="max-w-lg text-white/75">{pick(p.description, locale)}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {p.subServices.map((s, n) => (
                    <li key={n} className="flex items-start gap-3 text-white/90">
                      <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 bg-orange" />
                      {pick(s, locale)}
                    </li>
                  ))}
                </ul>
                {!pinned && (
                  <div className="mt-4 w-full">
                    <StaticFrame
                      img={images[i]}
                      href={href}
                      wide={wide}
                      badge={i === images.length - 1 ? badge : undefined}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>

          {pinned && (
            <div className="sticky top-[18vh] col-start-2 row-start-1 self-start">
              {chips}
              <WhatWeDoStage
                images={images}
                active={active}
                href={href}
                badge={badge}
                near={near}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
