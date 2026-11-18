"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ProjectModelViewer } from "@/components/three/ProjectModelViewer";
import { Container, SectionLabel } from "@/components/ui";
import type { Project } from "@/content/types";
import { Gallery } from "./Gallery";

/**
 * "Explore in 3D" (when a model exists) plus the photo gallery. They share one lightbox
 * so a hotspot in the 3D view can open the matching photo.
 */
export function ProjectMedia({ project, showModel }: { project: Project; showModel: boolean }) {
  const t = useTranslations("projectDetail");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {showModel && (
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
              modelUrl={project.modelUrl}
              hotspots={project.gallery.map((g) => g.caption)}
              onHotspot={setOpenIndex}
            />
            {!project.modelUrl && (
              <p className="text-small text-white/60">{t("explore.demoNote")}</p>
            )}
          </Container>
        </section>
      )}

      <section aria-labelledby="gallery-heading" className="section-y">
        <Container className="flex flex-col gap-10">
          <h2 id="gallery-heading" className="text-h2">
            {t("gallery")}
          </h2>
          <Gallery images={project.gallery} openIndex={openIndex} onOpenChange={setOpenIndex} />
        </Container>
      </section>
    </>
  );
}
