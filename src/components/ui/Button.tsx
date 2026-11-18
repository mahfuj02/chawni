import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "dark" | "outline" | "outline-light";
export type ButtonSize = "md" | "lg";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-200 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  // Text on orange is always ink (brand rule).
  primary: "bg-orange text-ink hover:bg-[#e06d17]",
  dark: "bg-ink text-white hover:bg-dark-2",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
  "outline-light": "border-2 border-white text-white hover:bg-white hover:text-ink",
};

const sizes: Record<ButtonSize, string> = {
  md: "",
  lg: "min-h-14 px-8 text-base",
};

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  return cn(base, variants[variant], sizes[size]);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render the child element (e.g. a Link) with button styles instead of a <button>. */
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonStyles(variant, size), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  );
}
