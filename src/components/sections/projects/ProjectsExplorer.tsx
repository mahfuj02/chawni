"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import {
  PROJECT_CATEGORIES,
  categorySlug,
  type ProjectCardData,
  type ProjectCategory,
} from "@/content/types";
import { Link } from "@/i18n/navigation";
import { filterByCategory, parseProjectCategory } from "@/lib/filters";
import { cn } from "@/lib/utils";
import { ProjectCard } from "../ProjectCard";

/** Presentational part. Also used as the Suspense fallback so the static HTML lists every project. */
export function ProjectsView({
  projects,
  category,
}: {
  projects: ProjectCardData[];
  category?: ProjectCategory;
}) {
  const t = useTranslations("projectsPage");
  const visible = filterByCategory(projects, category);

  const pill =
    "inline-flex min-h-11 items-center rounded-full border-2 px-5 text-[0.9375rem] font-semibold transition-colors";
  const on = "border-ink bg-ink text-white";
  const off = "border-line text-ink hover:border-ink";

  return (
    <div className="flex flex-col gap-10">
      <nav aria-label={t("filterLabel")}>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/projects"
              scroll={false}
              aria-current={!category ? "true" : undefined}
              className={cn(pill, !category ? on : off)}
            >
              {t("all")}
            </Link>
          </li>
          {PROJECT_CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                href={{ pathname: "/projects", query: { category: categorySlug(c) } }}
                scroll={false}
                aria-current={category === c ? "true" : undefined}
                className={cn(pill, category === c ? on : off)}
              >
                {t(categorySlug(c))}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p role="status" aria-live="polite" className="text-small text-muted">
        {t("count", { count: visible.length })}
      </p>

      {visible.length > 0 ? (
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-5 rounded-card bg-mist p-8 md:p-12">
          <p className="text-h3">{t("empty")}</p>
          <Button asChild variant="dark">
            <Link href="/projects" scroll={false}>
              {t("emptyAction")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

/** Reads `?category=` from the URL so filtered views can be shared and bookmarked. */
export function ProjectsExplorer({ projects }: { projects: ProjectCardData[] }) {
  const params = useSearchParams();
  const category = parseProjectCategory(params.get("category") ?? undefined);
  return <ProjectsView projects={projects} category={category} />;
}
