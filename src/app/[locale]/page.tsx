import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Hero } from "@/components/sections/home/Hero";
import { JournalPreview } from "@/components/sections/home/JournalPreview";
import { TeamSection } from "@/components/sections/home/TeamSection";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { WhatWeDo } from "@/components/sections/home/WhatWeDo";
import { WhoWeAre } from "@/components/sections/home/WhoWeAre";
import { WhyChawni } from "@/components/sections/home/WhyChawni";
import { getContentSource } from "@/lib/content-source";
import { organizationJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const base = pageMetadata({
    locale,
    path: "/",
    title: t("defaultTitle"),
    description: t("defaultDescription"),
  });
  // The home title is already complete, so it must not get the "| Chawni Architectures" suffix.
  return { ...base, title: { absolute: t("defaultTitle") } };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content = getContentSource();
  const [stats, phases, featured, leaders, disciplines, testimonials, clients, posts] =
    await Promise.all([
      content.getStats(),
      content.getPhases(),
      content.getFeaturedProjects(3),
      content.getLeaders(),
      content.getDisciplines(),
      content.getTestimonials(),
      content.getClients(),
      content.getPosts(),
    ]);

  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <Hero />
      <WhoWeAre stats={stats} />
      <WhatWeDo phases={phases} />
      <WhyChawni />
      <FeaturedProjects projects={featured} />
      <TeamSection leaders={leaders.slice(0, 3)} disciplines={disciplines} />
      <TrustedBy testimonial={testimonials[0]} clients={clients} />
      <JournalPreview posts={posts.slice(0, 3)} />
      <CtaBand />
    </>
  );
}
