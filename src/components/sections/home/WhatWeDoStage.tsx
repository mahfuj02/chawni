"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface StageImage {
  image: string;
  imageSmall: string;
  alt: string;
  caption: string;
}

const PILL =
  "inline-flex min-h-11 items-center rounded-[4px] bg-ink/80 px-3 text-[13px] font-medium text-white hover:bg-ink focus-visible:bg-ink";
const BADGE =
  "rounded-full bg-orange px-3.5 py-1.5 text-[13px] font-semibold whitespace-nowrap text-ink";

/**
 * Desktop frame: all four images are stacked in one 4:3 box and `active` (0–3) decides which are shown.
 * Moving forward the incoming image wipes in left to right over the previous one; moving back it is a
 * plain cross-fade. The active image zooms slowly. One caption pill and one badge, both driven by `active`.
 */
export function WhatWeDoStage({
  images,
  active,
  href,
  badge,
  near,
}: {
  images: StageImage[];
  active: number;
  href: string;
  badge: string;
  /** True once the section is close to the viewport: load all four images now. */
  near: boolean;
}) {
  // Direction of the last change, derived during render (the React-approved "previous value" pattern).
  const [last, setLast] = useState({ active, forward: true });
  if (last.active !== active) setLast({ active, forward: active > last.active });
  const forward = last.forward;

  return (
    <div
      data-testid="wwd-stage"
      data-active={active}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-ink"
    >
      {images.map((img, i) => {
        const shown = i <= active;
        return (
          <motion.div
            key={img.image}
            data-testid="wwd-layer"
            data-phase={i}
            aria-hidden={i !== active}
            className="absolute inset-0"
            style={{ zIndex: i }}
            initial={false}
            animate={
              shown
                ? {
                    opacity: 1,
                    clipPath: "inset(0 0 0 0)",
                    transition: {
                      opacity: { duration: 0 },
                      clipPath: { duration: forward ? 0.9 : 0, ease: "easeInOut" },
                    },
                  }
                : {
                    opacity: 0,
                    clipPath: "inset(0 100% 0 0)",
                    transition: {
                      opacity: { duration: 0.5 },
                      clipPath: { duration: 0, delay: 0.5 },
                    },
                  }
            }
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{
                scale: i === active ? 1.04 : 1,
                transition:
                  i === active ? { duration: 6, ease: "linear" } : { duration: 0, delay: 0.5 },
              }}
            >
              <Image
                src={img.image}
                alt={img.alt}
                fill
                sizes="(min-width:1024px) 45vw, 100vw"
                loading={near ? "eager" : "lazy"}
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        );
      })}

      <div className="absolute top-3 right-3 z-20">
        <AnimatePresence>
          {active === images.length - 1 && (
            <motion.span
              key="badge"
              data-testid="wwd-badge"
              className={cn(BADGE, "block")}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <Link
        href={href}
        data-testid="wwd-caption"
        className={cn(PILL, "absolute bottom-3 left-3 z-20 overflow-hidden")}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
          >
            {images[active].caption}
          </motion.span>
        </AnimatePresence>
      </Link>
    </div>
  );
}

/** One phase's image on its own (phones and reduced motion): no wipe, no zoom, no animation. */
export function StaticFrame({
  img,
  href,
  badge,
  wide,
}: {
  img: StageImage;
  href: string;
  /** Badge text, only for the final (Build) frame. */
  badge?: string;
  /** Use the 1600 px file instead of the 800 px one. */
  wide?: boolean;
}) {
  return (
    <div
      data-static-frame
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-ink"
    >
      <Image
        src={wide ? img.image : img.imageSmall}
        alt={img.alt}
        fill
        sizes={wide ? "(min-width:1024px) 45vw, 100vw" : "100vw"}
        className="object-cover"
      />
      {badge && <span className={cn(BADGE, "absolute top-3 right-3 z-10")}>{badge}</span>}
      <Link href={href} className={cn(PILL, "absolute bottom-3 left-3 z-10")}>
        {img.caption}
      </Link>
    </div>
  );
}
