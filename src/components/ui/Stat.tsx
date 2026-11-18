"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
  onDark?: boolean;
  className?: string;
}

/** Big number with a label. The counter animates once when it scrolls into view. */
export function Stat({
  value,
  suffix = "",
  decimals = 0,
  label,
  onDark = false,
  className,
}: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-2", className)}>
      <p
        className="font-heading text-[clamp(2.5rem,1.8rem+2.6vw,4rem)] leading-none font-semibold tracking-tight tabular-nums"
        aria-label={`${value.toFixed(decimals)}${suffix} ${label}`}
      >
        <span aria-hidden="true">
          {shown.toFixed(decimals)}
          <span className="text-orange">{suffix}</span>
        </span>
      </p>
      <p className={cn("text-small", onDark ? "text-white/75" : "text-muted")}>{label}</p>
    </div>
  );
}
