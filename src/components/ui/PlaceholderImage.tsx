import Image from "next/image";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  /** Short uppercase hint shown on the placeholder, e.g. "HOUSE EXTERIOR". */
  caption: string;
  /** CSS aspect-ratio, e.g. "16/9" or "4/5". Layout is identical with or without a real image. */
  aspect?: string;
  /** Real image path (under /public). While empty, the placeholder block is shown. */
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Neutral blue-grey block that stands in for a photo. Swapping in a real `src`
 * needs no layout change because both branches share the same sized wrapper.
 */
export function PlaceholderImage({
  caption,
  aspect = "16/9",
  src,
  alt,
  sizes = "(min-width: 1280px) 50vw, 100vw",
  priority = false,
  className,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-card bg-placeholder", className)}
      style={{ aspectRatio: aspect }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex items-end p-4 text-[0.6875rem] font-semibold tracking-[0.14em] text-placeholder-ink uppercase md:p-5"
        >
          <span aria-hidden="true">Photo · {caption}</span>
        </div>
      )}
    </div>
  );
}
