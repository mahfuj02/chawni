"use client";

import Image from "next/image";
import { PLAN_MARKUP } from "@/content/plan-markup";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface StageFrame {
  kind: "plan" | "render" | "structure" | "completed";
  image: string;
  alt: string;
  /** "Samriddhi · Render" */
  caption: string;
  href?: string;
  /** Build frame badge, e.g. "Completed · Windsor Hotel". */
  badge?: string;
}

/** The same drawing without ids, so the static copy never duplicates the ids of the pinned one. */
const STATIC_PLAN = PLAN_MARKUP.replace(/ id="[a-z]+"/g, "");

/** x positions (%) of the structural columns and y positions (%) of the slab lines in the x-ray overlay. */
const COLS = [20, 32, 44, 56, 68, 80];
const SLABS = [16, 30, 44, 58, 72, 86];

function StructureOverlay({ drawn }: { drawn: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cn("wwd-xray absolute inset-0 size-full", drawn && "is-drawn")}
    >
      {COLS.map((x, i) => (
        <line
          key={`c${x}`}
          className="wwd-xline wwd-xv"
          style={{ transitionDelay: `${0.15 + i * 0.12}s` }}
          x1={x}
          x2={x}
          y1={8}
          y2={94}
        />
      ))}
      {SLABS.map((y, i) => (
        <line
          key={`s${y}`}
          className="wwd-xline wwd-xh"
          style={{ transitionDelay: `${0.5 + i * 0.12}s` }}
          x1={12}
          x2={88}
          y1={y}
          y2={y}
        />
      ))}
    </svg>
  );
}

function Caption({ frame }: { frame: StageFrame }) {
  const cls =
    "absolute bottom-3 left-3 z-10 rounded-[4px] bg-ink/80 px-3 py-1.5 text-[13px] font-medium text-white";
  return frame.href ? (
    <Link href={frame.href} className={cn(cls, "hover:bg-ink focus-visible:bg-ink")}>
      {frame.caption}
    </Link>
  ) : (
    <span className={cls}>{frame.caption}</span>
  );
}

function Photo({ frame, zoom }: { frame: StageFrame; zoom?: boolean }) {
  return (
    <Image
      src={frame.image}
      alt={frame.alt}
      fill
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={cn("object-cover", zoom && "wwd-zoom")}
    />
  );
}

/** The four frames as one stack: each becomes visible when its phase is active (or any later one). */
export function WhatWeDoStage({ frames, active }: { frames: StageFrame[]; active: number }) {
  const [plan, design, structure, built] = frames;
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-white">
      {/* 01 Plan */}
      <div
        className={cn("absolute inset-0", active >= 2 && "wwd-under")}
        inert={active !== 0}
        aria-hidden={active !== 0}
      >
        <svg
          viewBox="0 0 1200 800"
          role="img"
          aria-label={plan.alt}
          className={cn("wwd-plan size-full", active === 0 && "is-active")}
          dangerouslySetInnerHTML={{ __html: PLAN_MARKUP }}
        />
        <Caption frame={plan} />
      </div>

      {/* 02 Design: wipes in over the plan, left to right */}
      <div
        className={cn(
          "wwd-wipe absolute inset-0",
          active >= 2 && "wwd-under",
          active >= 1 && "is-in",
          active === 1 && "is-active",
        )}
        inert={active !== 1}
        aria-hidden={active !== 1}
      >
        <Photo frame={design} zoom />
        <Caption frame={design} />
      </div>

      {/* 03 Engineer: image darkens, structural grid draws over it */}
      <div
        className={cn(
          "wwd-fade absolute inset-0",
          active >= 2 && "is-in",
          active >= 3 && "wwd-under",
        )}
        inert={active !== 2}
        aria-hidden={active !== 2}
      >
        <div className={cn("wwd-dim absolute inset-0 bg-black", active >= 2 && "is-dim")}>
          <div className="absolute inset-0">
            <Photo frame={structure} />
          </div>
        </div>
        <StructureOverlay drawn={active === 2} />
        <Caption frame={structure} />
      </div>

      {/* 04 Build: completed photo, the overlay is gone, badge slides in */}
      <div
        className={cn(
          "wwd-fade absolute inset-0",
          active >= 3 && "is-in",
          active === 3 && "is-active",
        )}
        inert={active !== 3}
        aria-hidden={active !== 3}
      >
        <Photo frame={built} />
        {built.badge && (
          <span className="wwd-badge absolute top-3 right-3 z-10 rounded-full bg-orange px-3.5 py-1.5 text-[13px] font-semibold text-ink">
            {built.badge}
          </span>
        )}
        <Caption frame={built} />
      </div>
    </div>
  );
}

/** One frame on its own (phones and reduced motion): final state, no animation. */
export function StaticFrame({ frame }: { frame: StageFrame }) {
  return (
    <div
      data-static-frame
      className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-white"
    >
      {frame.kind === "plan" ? (
        <svg
          viewBox="0 0 1200 800"
          role="img"
          aria-label={frame.alt}
          className="size-full"
          dangerouslySetInnerHTML={{ __html: STATIC_PLAN }}
        />
      ) : (
        <>
          <div className={cn("absolute inset-0", frame.kind === "structure" && "brightness-[.55]")}>
            <Photo frame={frame} />
          </div>
          {frame.kind === "structure" && <StructureOverlay drawn />}
          {frame.badge && (
            <span className="absolute top-3 right-3 z-10 rounded-full bg-orange px-3.5 py-1.5 text-[13px] font-semibold text-ink">
              {frame.badge}
            </span>
          )}
        </>
      )}
      <Caption frame={frame} />
    </div>
  );
}
