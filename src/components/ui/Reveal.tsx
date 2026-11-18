"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type State = "visible" | "hidden" | "shown";

/**
 * Fade-up on enter (16px, 0.6s). Content is visible without JS and for users who
 * prefer reduced motion; only elements below the fold are hidden then revealed.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : undefined }}
      className={cn(
        "transition-[opacity,transform] duration-[600ms] ease-[var(--ease-out)]",
        state === "hidden" && "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
