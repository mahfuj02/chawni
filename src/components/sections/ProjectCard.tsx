import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LazyPhoto } from "@/components/ui/LazyPhoto";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { categorySlug, type ProjectCardData } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { projectTitle } from "@/lib/project-text";

export function ProjectCard({
  project,
  priority = false,
  headingLevel: Heading = "h3",
}: {
  project: ProjectCardData;
  priority?: boolean;
  /** Use "h2" where the card follows the page title directly (listing pages). */
  headingLevel?: "h2" | "h3";
}) {
  const locale = useLocale();
  const t = useTranslations("projectsPage");
  const title = projectTitle(project, locale);
  const { cover } = project;

  return (
    <article className="group relative flex flex-col gap-5">
      <div className="relative">
        <LazyPhoto
          src={cover.thumb}
          alt={cover.alt}
          aspect="4/3"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          blur={cover.blur}
          eager={priority}
          className="rounded-card"
          imageClassName="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
        />
        <StatusBadge status={project.status} className="absolute top-3 left-3 z-10" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-label font-medium tracking-wide text-orange-text uppercase">
            {t(categorySlug(project.category))}
          </p>
          <Heading className="text-h3">
            {/* Stretched link: the whole card is clickable with one accessible name. */}
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {title}
            </Link>
          </Heading>
          <p className="text-small text-muted">
            {project.location}
            {project.year ? ` · ${project.year}` : ""}
          </p>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </div>
    </article>
  );
}
