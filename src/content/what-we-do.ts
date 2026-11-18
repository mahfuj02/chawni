import type { PhaseKey } from "./types";

/**
 * One visual per phase of the Home "what we do" sequence. These are stand-ins drawn from real projects;
 * when real plans and site photos exist for a single project, replace the four frames with that
 * project's own journey (see docs/CONTENT_GUIDE.md).
 */
export interface WhatWeDoFrame {
  phase: PhaseKey;
  /** Path under /public. */
  image: string;
  /** Project the frame links to (the plan drawing is generic and links nowhere). */
  projectSlug?: string;
  kind: "plan" | "render" | "structure" | "completed";
}

export const WHAT_WE_DO_FRAMES: WhatWeDoFrame[] = [
  { phase: "plan", image: "/what-we-do/plan.svg", kind: "plan" },
  {
    phase: "design",
    image: "/projects/samriddhi/samriddhi-01.jpg",
    projectSlug: "samriddhi",
    kind: "render",
  },
  {
    phase: "engineer",
    image: "/projects/dr-arafat-palace/dr-arafat-palace-01.jpg",
    projectSlug: "dr-arafat-palace",
    kind: "structure",
  },
  {
    phase: "build",
    image: "/projects/windsor-hotel/windsor-hotel-01.jpg",
    projectSlug: "windsor-hotel",
    kind: "completed",
  },
];
