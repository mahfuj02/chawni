import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Orange dot before the label. */
  dot?: boolean;
  onDark?: boolean;
}

export function Chip({ dot = false, onDark = false, className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full border px-4 text-small font-medium",
        onDark ? "border-white/25 text-white" : "border-line bg-white text-ink",
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className="size-2 rounded-full bg-orange" />}
      {children}
    </span>
  );
}
