"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { HeroScene } from "@/components/three/HeroScene";
import { useSceneGate } from "@/components/three/useSceneGate";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const HEADER_H = 88;

/**
 * Hero layout plus scroll pinning. When the 3D scene is allowed, the hero is a 250svh tall
 * track with a CSS-sticky stage inside: GSAP ScrollTrigger scrubs a 0..1 progress value over
 * the ~150svh of scrolling, which drives the logo-to-building animation. Otherwise it is a
 * normal single-screen hero.
 */
export function HeroStage({ title, children }: { title: string; children: ReactNode }) {
  const { ref: sceneRef, mode, near, inView } = useSceneGate<HTMLDivElement>();
  const track = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const pinned = mode.mode === "ready";

  useEffect(() => {
    if (!pinned) return;
    let cancelled = false;
    let kill: (() => void) | undefined;

    // GSAP is imported lazily so pages without 3D (and users without 3D) never download it.
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: track.current,
        start: `top top+=${HEADER_H}`,
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
      progress.current = trigger.progress;
      kill = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [pinned]);

  return (
    <section ref={track} className={cn("overflow-x-clip bg-sky text-ink", pinned && "h-[250svh]")}>
      <div
        className={cn(
          pinned && "sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden",
        )}
      >
        <Container
          className={cn(
            "grid items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16",
            pinned ? "h-full" : "min-h-[calc(100svh-var(--header-h))]",
          )}
        >
          <div className="flex flex-col items-start gap-8">{children}</div>
          <div className="mx-auto aspect-square w-full max-w-[640px] lg:max-h-full lg:max-w-none">
            <HeroScene
              title={title}
              sceneRef={sceneRef}
              run={pinned && near}
              inView={inView}
              progress={progress}
            />
          </div>
        </Container>
      </div>
    </section>
  );
}
