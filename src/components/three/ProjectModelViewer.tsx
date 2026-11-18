"use client";

import { Box, Camera, Rotate3d } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui";
import type { ProjectHotspot } from "@/content/types";
import { cn } from "@/lib/utils";
import { useMediaQuery, useSceneGate, useWebGLSupport } from "./useSceneGate";

const ViewerCanvas = dynamic(() => import("./ProjectViewerCanvas"), { ssr: false });

interface ProjectModelViewerProps {
  modelUrl: string;
  hotspots: ProjectHotspot[];
  /** Cover photo, shown as the poster until (and unless) the 3D view loads. */
  poster: { src: string; alt: string; blur?: string };
  /** Called with a 0-based gallery index when a hotspot is activated. */
  onHotspot: (photoIndex: number) => void;
}

/**
 * "Explore in 3D". Loads automatically on capable desktops once near the viewport; on
 * phones, low-power or reduced-motion setups it shows the cover photo until "Load 3D view"
 * is pressed. Hovering the section starts downloading the model early.
 */
export function ProjectModelViewer({
  modelUrl,
  hotspots,
  poster,
  onHotspot,
}: ProjectModelViewerProps) {
  const t = useTranslations("projectDetail.explore");
  const { ref, mode, near, inView } = useSceneGate<HTMLDivElement>("200px");
  const [requested, setRequested] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [explode, setExplode] = useState(false);
  const [photos, setPhotos] = useState(true);
  const preloaded = useRef(false);
  const smallScreen = useMediaQuery("(max-width: 767px), (pointer: coarse)");

  const pending = mode.mode === "pending";
  const supported =
    mode.mode === "ready" ||
    (mode.mode === "static" && (mode.reason === "low-power" || mode.reason === "reduced-motion"));
  const auto = mode.mode === "ready" && !smallScreen;
  const wantsLoad = supported && !failed && (requested || (auto && near));
  const webgl = useWebGLSupport(wantsLoad);
  const loaded = wantsLoad && webgl;
  const needsTap = supported && !failed && !wantsLoad && !pending;

  function preload() {
    if (preloaded.current || !supported) return;
    preloaded.current = true;
    void import("./ProjectViewerCanvas").then((m) => m.preloadModel(modelUrl));
  }

  const toggle = "min-h-11 px-5 text-sm aria-pressed:bg-white aria-pressed:text-ink";

  return (
    <div className="flex flex-col gap-4" onPointerEnter={preload}>
      <div
        ref={ref}
        role="group"
        aria-label={t("viewerLabel")}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-[#DBE7F2]"
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            canvasReady ? "opacity-0" : "opacity-100",
          )}
        >
          <Image
            src={poster.src}
            alt={poster.alt}
            fill
            sizes="(min-width: 1280px) 1296px, 100vw"
            placeholder={poster.blur ? "blur" : "empty"}
            blurDataURL={poster.blur}
            className="object-cover"
          />
        </div>

        {loaded && (
          <ViewerCanvas
            modelUrl={modelUrl}
            autoRotate={rotate}
            explode={explode}
            showHotspots={photos}
            hotspots={hotspots.map((h) => ({
              id: h.id,
              position: h.position,
              floor: h.floor,
              photoIndex: h.photo - 1,
              label: t("hotspot", { label: h.label, n: h.photo }),
            }))}
            onHotspot={onHotspot}
            active={inView}
            onReady={() => setCanvasReady(true)}
            onError={() => setFailed(true)}
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
