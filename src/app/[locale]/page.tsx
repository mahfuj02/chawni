import { setRequestLocale } from "next-intl/server";
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
