import type { Project, ProjectCardData } from "@/content/types";

/** Bangla title when one exists, otherwise the English title. */
export function projectTitle(
  p: Pick<Project | ProjectCardData, "title" | "titleBn">,
  locale: string,
) {
  return locale === "bn" && p.titleBn ? p.titleBn : p.title;
}
