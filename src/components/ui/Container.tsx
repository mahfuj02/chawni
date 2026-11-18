import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("px-gutter mx-auto w-full max-w-[1440px]", className)} {...props} />;
}
