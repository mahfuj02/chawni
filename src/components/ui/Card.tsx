import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: "light" | "mist" | "dark";
}

const tones = {
  light: "border border-line bg-white",
  mist: "bg-mist",
  dark: "bg-dark-2 text-white",
};

export function Card({ tone = "light", className, ...props }: CardProps) {
  return <div className={cn("rounded-card p-6 md:p-8", tones[tone], className)} {...props} />;
}
