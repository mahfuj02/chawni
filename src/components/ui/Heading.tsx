import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Size = "display" | "h2" | "h3";

const sizeClass: Record<Size, string> = {
  display: "text-display",
  h2: "text-h2",
  h3: "text-h3",
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: Size;
}

export function Heading({ as: Tag = "h2", size = "h2", className, ...props }: HeadingProps) {
  return <Tag className={cn(sizeClass[size], className)} {...props} />;
}
