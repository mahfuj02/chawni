"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { PhaseKey } from "@/content/types";
import { cn } from "@/lib/utils";
import { PhaseFallback } from "./PhaseFallback";
import { useSceneGate } from "./useSceneGate";

const PhaseCanvas = dynamic(() => import("./PhaseCanvas"), { ssr: false });

/** "What we do" scene. Static SVG until (and unless) the lazy 3D chunk is allowed and ready. */
export function PhaseScene({ phase, title }: { phase: PhaseKey; title: string }) {
  const { ref, mode, near, inView } = useSceneGate<HTMLDivElement>();
  const [ready, setReady] = useState(false);
  const run = mode.mode === "ready" && near;

  return (
    <div ref={ref} role="img" aria-label={title} className="relative size-full">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <PhaseFallback phase={phase} title={title} />
      </div>
      {run && (
        <div className="absolute inset-0">
          <PhaseCanvas phase={phase} active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
