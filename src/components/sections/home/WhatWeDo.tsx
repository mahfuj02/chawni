"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { PhaseScene } from "@/components/three/PhaseScene";
import { Container, SectionLabel } from "@/components/ui";
import type { Phase } from "@/content/types";
import { getLenis } from "@/lib/lenis";
import { pick } from "@/lib/localized";
import { cn } from "@/lib/utils";

/**
 * Dark "what we do" section. The 3D panel stays pinned (CSS sticky) while the four
 * phases scroll past; chips and scroll position stay in sync both ways.
 */
export function WhatWeDo({ phases }: { phases: Phase[] }) {
  const t = useTranslations("what");
  const locale = useLocale();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  function goTo(i: number) {
    setActive(i);
    const el = refs.current[i];
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -160 });
    else el.scrollIntoView({ behavior: "auto", block: "center" });
  }

  const current = phases[active] ?? phases[0];

  return (
    <section aria-labelledby="what-heading" className="on-dark section-y bg-ink text-white">
      <Container>
        <div className="mb-12 flex max-w-3xl flex-col gap-6 lg:mb-16">
          <SectionLabel onDark>{t("label")}</SectionLabel>
          <h2 id="what-heading" className="text-h2">
            {t("heading")}
          </h2>
          <p className="text-white/75">{t("text")}</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Pinned panel: chips + scene */}
          <div className="sticky top-[var(--header-h)] z-10 bg-ink py-3 lg:top-[calc(var(--header-h)+16px)] lg:col-start-2 lg:row-start-1 lg:self-start lg:py-6">
            <nav aria-label={t("phasesNav")}>
              <ul className="mb-4 flex flex-wrap gap-2">
                {phases.map((p, i) => (
                  <li key={p.key}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
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
            <div className="aspect-[16/10] max-h-[38vh] w-full overflow-hidden rounded-card bg-dark-2 lg:aspect-[4/3] lg:max-h-none">
              <PhaseScene phase={current.key} title={t("sceneLabel")} />
            </div>
          </div>

          {/* Phases */}
          <ol className="lg:col-start-1 lg:row-start-1">
            {phases.map((p, i) => (
              <li
                key={p.key}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-index={i}
                className="flex min-h-[55vh] flex-col justify-center gap-5 border-t border-white/15 py-12 lg:min-h-[75vh]"
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
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
