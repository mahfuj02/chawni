"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/components/three/useSceneGate";
import { formatNumber } from "@/lib/format";

/** Counts from 0 to `value` once, 1.2 s ease-out, when scrolled into view. Shows the final number at once with reduced motion. */
export function CountUp({
  value,
  locale,
  suffix = "",
}: {
  value: number;
  locale: string;
  suffix?: string;
}) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStarted(true);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || reduce) return;
    let raf = 0;
    let t0: number | undefined;
    const tick = (t: number) => {
      t0 ??= t;
      const p = Math.min(1, (t - t0) / 1200);
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, reduce, value]);

  const shown = reduce ? value : n;
  return (
    <span ref={ref} data-value={value} className="tabular-nums">
      {formatNumber(shown, locale)}
      {suffix}
    </span>
  );
}
