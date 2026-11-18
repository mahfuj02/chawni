"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProjectModelViewer } from "@/components/three/ProjectModelViewer";
import { Container, SectionLabel } from "@/components/ui";
import type { ProjectHotspot, ProjectImage } from "@/content/types";
import { Gallery } from "./Gallery";

interface ProjectMediaProps {
  images: ProjectImage[];
  modelUrl?: string;
  hotspots?: ProjectHotspot[];
  photoCredit?: string;
}

/**
 * "Explore in 3D" (only when the project has a model) plus the photo gallery. They share one
 * lightbox so a hotspot in the 3D view opens its photo.
 */
export function ProjectMedia({ images, modelUrl, hotspots = [], photoCredit }: ProjectMediaProps) {
  const t = useTranslations("projectDetail");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {modelUrl && (
        <section aria-labelledby="explore-heading" className="on-dark section-y bg-ink text-white">
          <Container className="flex flex-col gap-10">
            <div className="flex max-w-3xl flex-col gap-6">
              <SectionLabel onDark>{t("explore.label")}</SectionLabel>
              <h2 id="explore-heading" className="text-h2">
                {t("explore.heading")}
              </h2>
              <p className="text-white/75">{t("explore.text")}</p>
            </div>
            <ProjectModelViewer
              modelUrl={modelUrl}
              hotspots={hotspots}
              poster={{ src: images[0].thumb, alt: images[0].alt, blur: images[0].blur }}
              onHotspot={setOpenIndex}
            />
            <p className="text-small text-white/60">{t("explore.massingNote")}</p>
          </Container>
        </section>
      )}

      <section aria-labelledby="gallery-heading" className="section-y">
        <Container className="flex flex-col gap-10">
          <h2 id="gallery-heading" className="text-h2">
            {t("gallery")}
          </h2>
          <Gallery images={images} openIndex={openIndex} onOpenChange={setOpenIndex} />
          {photoCredit && (
            <p className="text-small text-muted">{t("photoCredit", { name: photoCredit })}</p>
          )}
        </Container>
      </section>
    </>
  );
}
