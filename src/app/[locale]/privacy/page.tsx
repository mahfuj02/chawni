import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return pageMetadata({ locale, path: "/privacy", title: t("title"), description: t("updated") });
}

export default async function PrivacyPage({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");

  const sections = [
    { title: t("collectTitle"), text: t("collectText") },
    { title: t("shareTitle"), text: t("shareText") },
    { title: t("rightsTitle"), text: t("rightsText") },
  ];

  return (
    <>
      <PageHero
        label={t("title")}
        title={t("heading")}
        text={t("updated")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: t("title") }]}
      />
      <section className="section-y pt-12 md:pt-16">
        <Container>
          <div className="flex max-w-3xl flex-col gap-10">
            {sections.map((s) => (
              <div key={s.title} className="flex flex-col gap-3">
                <h2 className="text-h3">{s.title}</h2>
                <p className="text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
