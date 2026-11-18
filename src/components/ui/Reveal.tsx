import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade-up on enter (16px, 0.6s feel), implemented in pure CSS with a scroll-driven
 * `view()` timeline (see `.reveal` in globals.css). No JavaScript and no hydration cost.
 * Browsers without scroll-driven animations, and users who prefer reduced motion, simply
 * see the content in place.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Stagger in milliseconds (approximate: it shifts where the animation starts). */
  delay?: number;
  className?: string;
}) {
  const style = delay
    ? ({ "--reveal-delay": `${Math.min(delay / 20, 20)}%` } as CSSProperties)
    : undefined;
  return (
    <div className={cn("reveal", className)} style={style}>
      {children}
    </div>
  );
}
