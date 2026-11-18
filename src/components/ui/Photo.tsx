import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio of the frame, e.g. "4/3". The photo is cropped to fill it. */
  aspect?: string;
  /** Blur placeholder (data URL) from src/content/blur.json, passed down from a server component. */
  blur?: string;
  /** Always set this: it is what lets the browser download the smallest sufficient file. */
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

/** A real photograph in a fixed-aspect frame, with a blur placeholder while it loads. */
export function Photo({
  src,
  alt,
  aspect = "4/3",
  blur,
  sizes,
  priority = false,
  className,
  imageClassName,
}: PhotoProps) {
  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-card bg-placeholder", className)}
      style={{ aspectRatio: aspect }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
