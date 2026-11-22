import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Intro } from "@/components/intro/Intro";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/home/FeaturedProjects";
import { Hero } from "@/components/sections/hero/Hero";
import { JournalPreview } from "@/components/sections/home/JournalPreview";
import { TeamSection } from "@/components/sections/home/TeamSection";
import { TrustedBy } from "@/components/sections/home/TrustedBy";
import { WhoWeAre } from "@/components/sections/home/WhoWeAre";
import { WhyChawni } from "@/components/sections/home/WhyChawni";
import type { StageImage } from "@/components/sections/home/WhatWeDoStage";
import { PROCESS_IMAGES, PROCESS_PROJECT_SLUG } from "@/content/process";
import { pick } from "@/lib/localized";
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

  const tw = await getTranslations({ locale, namespace: "what" });
  const images: StageImage[] = PROCESS_IMAGES.map((p) => ({
    image: p.image,
    imageSmall: p.imageSmall,
    alt: pick(p.alt, locale),
    caption: pick(p.caption, locale),
  }));

  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <Intro locale={locale} />
      <Hero locale={locale} />
      <WhoWeAre stats={stats} />
      <WhatWeDo
        phases={phases}
        images={images}
        href={`/projects/${PROCESS_PROJECT_SLUG}`}
        badge={tw("badge")}
      />
      <WhyChawni />
      <FeaturedProjects projects={featured} />
      {/* Home shows the first three members (the leadership row), in team order. */}
      <TeamSection members={team.slice(0, 3)} disciplines={disciplines} />
      <TrustedBy testimonial={testimonials[0]} clients={clients} />
      <JournalPreview posts={posts.slice(0, 3)} />
      <CtaBand />
    </>
  );
}
