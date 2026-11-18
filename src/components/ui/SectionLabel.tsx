import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  onDark = false,
  className,
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-label font-medium tracking-wide lowercase",
        onDark ? "text-white" : "text-orange-text",
        className,
      )}
    >
      <span aria-hidden="true" className="block size-2.5 bg-orange" />
      {children}
    </p>
  );
}
