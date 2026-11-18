import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectsExplorer, ProjectsView } from "@/components/sections/projects/ProjectsExplorer";
import { Container } from "@/components/ui";
import { getContentSource } from "@/lib/content-source";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectsPage" });
  return pageMetadata({ locale, path: "/projects", title: t("title"), description: t("heroText") });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projectsPage");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const projects = await getContentSource().getProjects();

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("heroTitle")}
        text={t("heroText")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: tn("projects") }]}
      />
      <section aria-label={t("title")} className="section-y pt-12 md:pt-16">
        <Container>
          {/* The page is statically generated; the filter reads ?category= on the client.
              The fallback is the unfiltered list, so the static HTML is complete. */}
          <Suspense fallback={<ProjectsView projects={projects} />}>
            <ProjectsExplorer projects={projects} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
