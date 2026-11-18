import { ArrowLeft, ArrowUpRight, Quote } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectMedia } from "@/components/sections/project/ProjectMedia";
import { Container, PlaceholderImage, SectionLabel } from "@/components/ui";
import { hasModel } from "@/content";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { formatNumber } from "@/lib/format";
import { projectJsonLd } from "@/lib/jsonld";
import { pick } from "@/lib/localized";
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
    title: pick(project.title, locale),
    description: pick(project.summary, locale),
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

  const facts = [
    { label: t("location"), value: pick(project.location, locale) },
    { label: t("client"), value: pick(project.client, locale) },
    { label: t("size"), value: t("sqft", { value: formatNumber(project.sizeSqft, locale) }) },
    { label: t("scope"), value: pick(project.scope, locale) },
    {
      label: t("completed"),
      value:
        project.status === "ongoing"
          ? t("ongoing")
          : formatNumber(project.year, locale).replace(/,/g, ""),
    },
  ];

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
          <SectionLabel>{tp(project.category)}</SectionLabel>
          <h1 className="max-w-5xl text-display">{pick(project.title, locale)}</h1>
        </Container>
      </section>

      <Container>
        <PlaceholderImage
          caption={project.hero.caption}
          aspect="16/9"
          src={project.hero.src}
          alt={pick(project.hero.alt, locale)}
          sizes="100vw"
          priority
        />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-b border-line py-8 md:grid-cols-3 lg:grid-cols-5">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className="text-label font-medium tracking-wide text-muted uppercase">
                {f.label}
              </dt>
              <dd className="font-medium">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <section aria-label={`${t("brief")} / ${t("solution")}`} className="section-y">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div className="flex flex-col gap-4">
            <h2 className="text-h3">{t("brief")}</h2>
            <p className="text-muted">{pick(project.brief, locale)}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-h3">{t("solution")}</h2>
            <p className="text-muted">{pick(project.solution, locale)}</p>
          </div>
        </Container>
      </section>

      <ProjectMedia project={project} showModel={hasModel(project)} />

      <section aria-label={t("quote")} className="section-y bg-mist">
        <Container>
          <figure className="flex max-w-4xl flex-col gap-6">
            <Quote aria-hidden="true" className="size-10 text-orange" strokeWidth={1.5} />
            <blockquote className="font-heading text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-snug font-semibold">
              {pick(project.quote.text, locale)}
            </blockquote>
            <figcaption className="text-muted">{pick(project.quote.author, locale)}</figcaption>
          </figure>
        </Container>
      </section>

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
                <span className="text-h2">{pick(next.title, locale)}</span>
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
