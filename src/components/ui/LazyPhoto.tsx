"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyPhotoProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio of the frame, e.g. "4/3" or "1366/2048". */
  aspect: string;
  sizes: string;
  /** Tiny blur placeholder (data URL), shown until the photo has loaded. */
  blur?: string;
  /** Load immediately (use for the first row of a grid). */
  eager?: boolean;
  className?: string;
  imageClassName?: string;
}

/**
 * Like `Photo`, but the image is only requested once its frame is within 300 px of the viewport.
 * Browsers' built-in `loading="lazy"` starts fetching up to ~2500 px early on fast connections,
 * which pulled a whole 24-photo gallery in at page load; this keeps that bandwidth for what is visible.
 */
export function LazyPhoto({
  src,
  alt,
  aspect,
  sizes,
  blur,
  eager = false,
  className,
  imageClassName,
}: LazyPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden bg-placeholder", className)}
      style={{
        aspectRatio: aspect,
        ...(blur && !near ? { backgroundImage: `url(${blur})`, backgroundSize: "cover" } : {}),
      }}
    >
      {near && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          className={cn("object-cover", imageClassName)}
        />
      )}
      {/* Not-yet-loaded frames still expose the alt text to assistive tech. */}
      {!near && <span className="sr-only">{alt}</span>}
    </div>
  );
}
