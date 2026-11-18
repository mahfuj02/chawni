"use client";

import dynamic from "next/dynamic";
import { useState, type MutableRefObject, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { HeroFallback } from "./HeroFallback";

// three.js and react-three-fiber live only in this lazy chunk, never in the shared bundle.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

interface HeroSceneProps {
  title: string;
  sceneRef: RefObject<HTMLDivElement | null>;
  /** 3D is allowed on this device and the box is near the viewport. */
  run: boolean;
  /** The box is currently on screen (rendering pauses otherwise). */
  inView: boolean;
  progress: MutableRefObject<number>;
}

/**
 * Hero visual. The static SVG is always rendered (server HTML, reduced motion, no WebGL,
 * low-power devices). When 3D is allowed and the box is near the viewport the canvas mounts
 * on top and the SVG fades out once it is ready.
 */
export function HeroScene({ title, sceneRef, run, inView, progress }: HeroSceneProps) {
  const [ready, setReady] = useState(false);

  return (
    <div ref={sceneRef} role="img" aria-label={title} className="relative size-full">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        <HeroFallback title={title} />
      </div>
      {run && (
        <div className="absolute inset-0">
          <HeroCanvas progress={progress} active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
