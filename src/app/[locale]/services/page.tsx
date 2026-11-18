import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Card, Container, PlaceholderImage, Reveal, SectionLabel } from "@/components/ui";
import { getContentSource } from "@/lib/content-source";
import { pick } from "@/lib/localized";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return pageMetadata({
    locale,
    path: "/services",
    title: t("title"),
    description: t("heroTitle"),
  });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const content = getContentSource();
  const [phases, sectors] = await Promise.all([content.getPhases(), content.getSectors()]);

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("heroTitle")}
        text={t("heroText")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: tn("services") }]}
      />

      <section aria-label={t("phasesLabel")} className="section-y">
        <Container className="flex flex-col gap-20 md:gap-28">
          {phases.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={p.key}
                id={p.key}
                aria-labelledby={`phase-${p.key}`}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"
              >
                <Reveal className={cn(flip && "lg:order-2")}>
                  <PlaceholderImage
                    caption={`${p.number} · ${p.title.en.toUpperCase()}`}
                    aspect="4/3"
                    alt={`${pick(p.title, locale)} (placeholder)`}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </Reveal>
                <Reveal delay={100} className="flex flex-col gap-6">
                  <span
                    aria-hidden="true"
                    className="font-heading text-[clamp(4rem,2.5rem+6vw,8rem)] leading-none font-semibold text-orange"
                  >
                    {p.number}
                  </span>
                  <h2 id={`phase-${p.key}`} className="text-h2">
                    {pick(p.title, locale)}
                  </h2>
                  <p className="max-w-xl text-muted">{pick(p.description, locale)}</p>
                  <div>
                    <h3 className="mb-3 text-label font-semibold tracking-wide uppercase">
                      {t("includes")}
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {p.subServices.map((s, n) => (
                        <li key={n} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 bg-orange" />
                          {pick(s, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </Container>
      </section>

      <section aria-labelledby="sectors-heading" className="section-y bg-mist">
        <Container>
          <div className="mb-12 flex max-w-3xl flex-col gap-6">
            <SectionLabel>{t("sectorsLabel")}</SectionLabel>
            <h2 id="sectors-heading" className="text-h2">
              {t("sectorsTitle")}
            </h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sectors.map((s, i) => (
              <li key={s.key}>
                <Reveal delay={i * 80} className="h-full">
                  <Card className="flex h-full flex-col gap-3">
                    <span aria-hidden="true" className="block h-1 w-10 bg-orange" />
                    <h3 className="text-h3">{pick(s.title, locale)}</h3>
                    <p className="text-muted">{pick(s.description, locale)}</p>
                  </Card>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
