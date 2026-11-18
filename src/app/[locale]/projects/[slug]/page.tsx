import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectMedia } from "@/components/sections/project/ProjectMedia";
import { Container, Photo, SectionLabel, StatusBadge } from "@/components/ui";
import { STATUS_KEY, categorySlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { projectJsonLd } from "@/lib/jsonld";
import { projectTitle } from "@/lib/project-text";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getContentSource().getProjects();
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getContentSource().getProject(slug);
  if (!project) return {};
  return pageMetadata({
    locale,
    path: `/projects/${slug}`,
    title: projectTitle(project, locale),
    description: project.summary,
    // The real cover photo becomes the social card (see opengraph-image.tsx).
  });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const content = getContentSource();
  const project = await content.getProject(slug);
  if (!project) notFound();
  const next = await content.getNextProject(slug);

  const t = await getTranslations("projectDetail");
  const tp = await getTranslations("projectsPage");

  // Only the facts that exist are shown.
  const facts = [
    { label: t("location"), value: project.location },
    { label: t("client"), value: project.client },
    { label: t("area"), value: project.area },
    { label: t("year"), value: project.year },
    { label: t("scope"), value: project.scope },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));
  const cover = project.images.find((i) => i.src === project.cover) ?? project.images[0];

  return (
    <>
      <JsonLd data={projectJsonLd(project, locale)} />
      <section className="section-y pb-10 md:pb-12">
        <Container className="flex flex-col gap-6">
          <Link
            href="/projects"
            className="inline-flex min-h-11 w-fit items-center gap-2 text-small font-medium text-muted hover:text-ink"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t("back")}
          </Link>
          <SectionLabel>{tp(categorySlug(project.category))}</SectionLabel>
          <h1 className="max-w-5xl text-display">{projectTitle(project, locale)}</h1>
        </Container>
      </section>

      <Container>
        <div className="relative">
          <Photo
            src={cover.src}
            alt={cover.alt}
            blur={cover.blur}
            aspect="16/9"
            sizes="(min-width: 1440px) 1296px, 100vw"
            priority
          />
          <StatusBadge status={project.status} className="absolute top-4 left-4 z-10" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-line py-8 md:grid-cols-3 lg:grid-cols-6">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className="text-label font-medium tracking-wide text-muted uppercase">
                {f.label}
              </dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            <dt className="text-label font-medium tracking-wide text-muted uppercase">
              {t("status")}
            </dt>
            <dd className="font-medium">{tp(`status.${STATUS_KEY[project.status]}`)}</dd>
          </div>
        </dl>
      </Container>

      <section aria-label={t("about")} className="section-y">
        <Container>
          <p className="max-w-3xl text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] leading-snug">
            {project.summary}
          </p>
          {locale === "bn" && <p className="mt-4 text-small text-muted">{t("englishOnly")}</p>}
        </Container>
      </section>

      <ProjectMedia
        images={project.images}
        modelUrl={project.modelUrl}
        hotspots={project.hotspots}
        photoCredit={project.photoCredit}
      />

      {next && (
        <section aria-label={t("nextProject")} className="on-dark bg-ink text-white">
          <Container>
            <Link
              href={`/projects/${next.slug}`}
              className="group flex flex-col gap-4 py-14 md:flex-row md:items-center md:justify-between md:py-20"
            >
              <span className="flex flex-col gap-3">
                <span className="text-label font-medium tracking-wide text-white/70 uppercase">
                  {t("nextProject")}
                </span>
                <span className="text-h2">{projectTitle(next, locale)}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-14 text-orange transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
              />
            </Link>
          </Container>
        </section>
      )}
    </>
  );
}
