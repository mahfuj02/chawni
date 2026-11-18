"use client";

import type { PhaseKey } from "@/content/types";
import { PhaseFallback } from "./PhaseFallback";

/** "What we do" 3D slot. Phase 6 replaces the static fallback with the lazy-loaded scene. */
export function PhaseScene({ phase, title }: { phase: PhaseKey; title: string }) {
  return <PhaseFallback phase={phase} title={title} />;
}
