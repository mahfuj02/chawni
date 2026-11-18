import type { HeroSlide } from "@/content/hero";
import type { Project } from "@/content/types";
import { projectTitle } from "@/lib/project-text";

/** Caption for a hero slide, looked up from its project so it stays in sync (and translated). */
export function heroCaption(
  slide: HeroSlide,
  projects: Pick<Project, "slug" | "title" | "titleBn" | "location" | "scope">[],
  locale: string,
  statusLabel: (slug: string) => string,
) {
  const project = projects.find((p) => p.slug === slide.projectSlug);
  if (!project)
    throw new Error(`Hero slide "${slide.id}" points at unknown project "${slide.projectSlug}"`);
  return {
    title: projectTitle(project, locale),
    meta: [project.location, project.scope, statusLabel(project.slug)].join(" · "),
    href: `/projects/${project.slug}`,
  };
}
