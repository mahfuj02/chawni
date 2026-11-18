import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PlaceholderImage } from "@/components/ui";
import type { Project } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localized";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("projectsPage");
  const title = pick(project.title, locale);

  return (
    <article className="group relative flex flex-col gap-5">
      <div className="overflow-hidden rounded-card">
        <div className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
          <PlaceholderImage
            caption={project.hero.caption}
            aspect="4/3"
            src={project.hero.src}
            alt={pick(project.hero.alt, locale)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-label font-medium tracking-wide text-orange-text uppercase">
            {t(project.category)}
          </p>
          <h3 className="text-h3">
            {/* Stretched link: the whole card is clickable with one accessible name. */}
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {title}
            </Link>
          </h3>
          <p className="text-small text-muted">
            {pick(project.location, locale)} · {project.year}
          </p>
        </div>
        <ArrowUpRight
          aria-hidden="true"
          className="mt-1 size-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100"
        />
      </div>
    </article>
  );
}
