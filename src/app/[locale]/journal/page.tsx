import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { JournalExplorer, JournalView } from "@/components/sections/journal/JournalExplorer";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui";
import { getContentSource } from "@/lib/content-source";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journalPage" });
  return pageMetadata({ locale, path: "/journal", title: t("title"), description: t("heroText") });
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journalPage");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const posts = await getContentSource().getPosts();

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("heroTitle")}
        text={t("heroText")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: tn("journal") }]}
      />
      <section aria-label={t("title")} className="section-y pt-12 md:pt-16">
        <Container>
          <Suspense fallback={<JournalView posts={posts} />}>
            <JournalExplorer posts={posts} />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
