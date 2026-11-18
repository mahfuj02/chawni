"use client";

import { Box, Camera, Rotate3d } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PhaseFallback } from "./PhaseFallback";
import { useMediaQuery, useSceneGate } from "./useSceneGate";

const ViewerCanvas = dynamic(() => import("./ProjectViewerCanvas"), { ssr: false });

interface ProjectModelViewerProps {
  /** GLB path. When absent the procedural demo building is shown. */
  modelUrl?: string;
  /** Gallery captions, one hotspot per photo. */
  hotspots: string[];
  /** Called with a gallery index when a hotspot is activated. */
  onHotspot: (index: number) => void;
}

/**
 * "Explore in 3D". Loads automatically on capable desktops once near the viewport; on
 * phones, low-power or reduced-motion setups it shows a poster until "Load 3D view" is pressed.
 */
export function ProjectModelViewer({ modelUrl, hotspots, onHotspot }: ProjectModelViewerProps) {
  const t = useTranslations("projectDetail.explore");
  const { ref, mode, near, inView } = useSceneGate<HTMLDivElement>("200px");
  const [requested, setRequested] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [explode, setExplode] = useState(false);
  const [photos, setPhotos] = useState(false);

  const smallScreen = useMediaQuery("(max-width: 767px), (pointer: coarse)");

  const pending = mode.mode === "pending";
  const supported =
    mode.mode === "ready" ||
    (mode.mode === "static" && (mode.reason === "low-power" || mode.reason === "reduced-motion"));
  const auto = mode.mode === "ready" && !smallScreen;
  const loaded = supported && (requested || (auto && near));
  const needsTap = supported && !loaded && !pending;

  const toggle = "aria-pressed:bg-white aria-pressed:text-ink min-h-11 px-5 text-sm";

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        role="group"
        aria-label={t("viewerLabel")}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-dark-2"
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            canvasReady ? "opacity-0" : "opacity-100",
          )}
        >
          <PhaseFallback phase="build" title={t("viewerLabel")} />
        </div>

        {loaded && (
          <ViewerCanvas
            modelUrl={modelUrl}
            autoRotate={rotate}
            explode={explode}
            showHotspots={photos}
            hotspots={hotspots.map((caption) => ({
              label: t("hotspot", { name: caption.toLowerCase() }),
            }))}
            onHotspot={onHotspot}
            active={inView}
            onReady={() => setCanvasReady(true)}
            loadingLabel={t("loading")}
          />
        )}

        {needsTap && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
            <Button size="lg" onClick={() => setRequested(true)}>
              <Box aria-hidden="true" className="size-5" />
              {t("load")}
            </Button>
          </div>
        )}
      </div>

      <div role="toolbar" aria-label={t("viewerLabel")} className="flex flex-wrap gap-3">
        <Button
          variant="outline-light"
          className={toggle}
          aria-pressed={rotate}
          disabled={!canvasReady}
          onClick={() => setRotate((v) => !v)}
        >
          <Rotate3d aria-hidden="true" className="size-4" />
          {t("rotate")}
        </Button>
        <Button
          variant="outline-light"
          className={toggle}
          aria-pressed={explode}
          disabled={!canvasReady}
          onClick={() => setExplode((v) => !v)}
        >
          <Box aria-hidden="true" className="size-4" />
          {t("explode")}
        </Button>
        <Button
          variant="outline-light"
          className={toggle}
          aria-pressed={photos}
          disabled={!canvasReady}
          onClick={() => setPhotos((v) => !v)}
        >
          <Camera aria-hidden="true" className="size-4" />
          {t("photos")}
        </Button>
      </div>
    </div>
  );
}
