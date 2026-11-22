import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { TeamCard } from "@/components/sections/TeamCard";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Photo, Reveal, SectionLabel } from "@/components/ui";
import { company } from "@/content";
import { getBlur } from "@/lib/blur";
import { getContentSource } from "@/lib/content-source";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return pageMetadata({ locale, path: "/about", title: t("title"), description: t("heroText") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const team = await getContentSource().getTeam();
  const tt = await getTranslations("team");
  const founders = team.filter((m) => m.title === "Co-founder");
  const others = team.filter((m) => m.title !== "Co-founder");

  const registrations = [
    { label: t("tradeLicence"), value: company.registrations.tradeLicence },
    { label: t("ieb"), value: company.registrations.iebMembership },
    { label: t("iab"), value: company.registrations.iabMembership },
  ];
  const recognition = [t("recognition1"), t("recognition2"), t("recognition3")];

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("heroTitle")}
        text={t("heroText")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: tn("about") }]}
      />

      <Container className="pt-12 md:pt-16">
        <Photo
          src="/projects/chawni-studio/chawni-studio-01.jpg"
          blur={getBlur("/projects/chawni-studio/chawni-studio-01-1200.jpg")}
          aspect="21/9"
          alt={t("photoAlt")}
          sizes="(min-width: 1440px) 1296px, 100vw"
          priority
          className="min-h-48"
        />
      </Container>

      <section aria-labelledby="story-heading" className="section-y">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-6">
            <SectionLabel>{t("storyLabel")}</SectionLabel>
            <h2 id="story-heading" className="text-h2">
              {t("storyTitle")}
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-6 text-muted">
            <p>{t("storyP1")}</p>
            <p>{t("storyP2")}</p>
          </Reveal>
        </Container>
      </section>

      <section
        aria-label={`${t("missionTitle")} / ${t("visionTitle")}`}
        className="on-dark section-y bg-ink text-white"
      >
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="flex flex-col gap-5 border-t-4 border-orange pt-8">
            <SectionLabel onDark>{t("missionLabel")}</SectionLabel>
            <h2 className="text-h2">{t("missionTitle")}</h2>
            <p className="text-white/75">{t("missionText")}</p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-5 border-t-4 border-orange pt-8">
            <SectionLabel onDark>{t("visionTitle").toLowerCase()}</SectionLabel>
            <h2 className="text-h2">{t("visionTitle")}</h2>
            <p className="text-white/75">{t("visionText")}</p>
          </Reveal>
        </Container>
      </section>

      <section id="leadership" aria-labelledby="leadership-heading" className="section-y">
        <Container>
          <div className="mb-12 flex max-w-3xl flex-col gap-6">
            <SectionLabel>{t("leadershipLabel")}</SectionLabel>
            <h2 id="leadership-heading" className="text-h2">
              {t("leadershipTitle")}
            </h2>
          </div>
          <h3 className="mb-6 text-h3">{tt("foundersTitle")}</h3>
          <ul className="grid max-w-4xl gap-x-6 gap-y-12 sm:grid-cols-2">
            {founders.map((m, i) => (
              <li key={m.slug}>
                <Reveal delay={i * 100}>
                  <TeamCard member={m} large />
                </Reveal>
              </li>
            ))}
          </ul>
          <h3 className="mt-16 mb-6 text-h3">{tt("membersTitle")}</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((m, i) => (
              <li key={m.slug}>
                <Reveal delay={(i % 5) * 100}>
                  <TeamCard member={m} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="registrations-heading" className="section-y bg-mist">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-6">
            <SectionLabel>{t("registrationsLabel")}</SectionLabel>
            <h2 id="registrations-heading" className="text-h2">
              {t("registrationsTitle")}
            </h2>
          </div>
          <div className="flex flex-col gap-10">
            <dl className="divide-y divide-line">
              {registrations.map((r) => (
                <div key={r.label} className="flex flex-wrap justify-between gap-2 py-4">
                  <dt className="font-medium">{r.label}</dt>
                  <dd className="text-muted">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <h3 className="mb-4 text-h3">{t("recognitionTitle")}</h3>
              <ul className="flex flex-col gap-3">
                {recognition.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-muted">
                    <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 bg-orange" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
