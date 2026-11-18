import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Hero } from "@/components/sections/home/Hero";
import { JournalPreview } from "@/components/sections/home/JournalPreview";
import { TeamSection } from "@/components/sections/home/TeamSection";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { WhoWeAre } from "@/components/sections/home/WhoWeAre";
import { WhyChawni } from "@/components/sections/home/WhyChawni";
import { getContentSource } from "@/lib/content-source";
import { organizationJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

// Below the fold and interaction-heavy: its own chunk + Suspense boundary, so React hydrates it in
// separate time-sliced work instead of one long task during start-up (better TBT).
const WhatWeDo = dynamic(() =>
  import("@/components/sections/home/WhatWeDo").then((m) => m.WhatWeDo),
);

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
  const [stats, phases, featured, team, disciplines, testimonials, clients, posts] =
    await Promise.all([
      content.getStats(),
      content.getPhases(),
      content.getFeaturedProjects(),
      content.getTeam(),
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
      {/* Home shows the members who have a photo. */}
      <TeamSection members={team.filter((m) => m.photo)} disciplines={disciplines} />
      <TrustedBy testimonial={testimonials[0]} clients={clients} />
      <JournalPreview posts={posts.slice(0, 3)} />
      <CtaBand />
    </>
  );
}
