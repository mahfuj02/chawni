import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoVariant = "dark" | "light";

interface LogoProps {
  /** "dark" = dark-on-light artwork, "light" = light-on-dark artwork. */
  variant?: LogoVariant;
  /** Convenience alias: true picks the light artwork. */
  onDark?: boolean;
  /** Compact lockup without the small "architects & engineers" line. */
  compact?: boolean;
  /** Rendered width in px; height follows the artwork's aspect ratio. */
  width?: number;
  priority?: boolean;
  className?: string;
}

const ART = {
  full: { w: 1070, h: 1160 },
  compact: { w: 1070, h: 1090 },
} as const;

export function logoSrc(variant: LogoVariant, compact: boolean) {
  const tone = variant === "light" ? "light-on-dark" : "dark-on-light";
  return `/brand/chawni-logo-${tone}${compact ? "-compact" : ""}.svg`;
}

/** Brand logo. The SVG files are never altered, only chosen. See docs/BRAND.md. */
export function Logo({
  variant,
  onDark = false,
  compact = false,
  width = 120,
  priority = false,
  className,
}: LogoProps) {
  const resolved: LogoVariant = variant ?? (onDark ? "light" : "dark");
  const art = compact ? ART.compact : ART.full;
  return (
    <Image
      src={logoSrc(resolved, compact)}
      alt="Chawni Architectures"
      width={width}
      height={Math.round((width * art.h) / art.w)}
      priority={priority}
      unoptimized
      className={cn("h-auto", className)}
      style={{ width }}
    />
  );
}
