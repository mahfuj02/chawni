"use client";

import { useTranslations } from "next-intl";
import { PhaseFallback } from "./PhaseFallback";

interface ProjectModelViewerProps {
  /** GLB path. When absent the procedural demo building is shown. */
  modelUrl?: string;
  /** Gallery captions, one hotspot per photo. */
  hotspots: string[];
  /** Called with a gallery index when a hotspot is activated. */
  onHotspot: (index: number) => void;
}

/** Phase 6 replaces this static stand-in with the lazy-loaded interactive viewer. */
export function ProjectModelViewer(props: ProjectModelViewerProps) {
  const t = useTranslations("projectDetail.explore");
  void props;
  return (
    <div className="aspect-[16/10] w-full overflow-hidden rounded-card bg-dark-2">
      <PhaseFallback phase="build" title={t("viewerLabel")} />
    </div>
  );
}
