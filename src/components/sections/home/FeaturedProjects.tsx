import { useTranslations } from "next-intl";
import { ArrowLink, Container, Reveal, SectionLabel } from "@/components/ui";
import type { Project } from "@/content/types";
import { ProjectCard } from "../ProjectCard";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const t = useTranslations("projectsSection");

  return (
    <section aria-labelledby="projects-heading" className="section-y">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 id="projects-heading" className="text-h2">
              {t("heading")}
            </h2>
          </div>
          <ArrowLink href="/projects">{t("seeAll")}</ArrowLink>
        </div>
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 100}>
                <ProjectCard project={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
