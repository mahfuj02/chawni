import { useLocale, useTranslations } from "next-intl";
import { ArrowLink, Chip, Container, Reveal, SectionLabel } from "@/components/ui";
import type { TeamMemberCardData } from "@/content/types";
import { pick, type Localized } from "@/lib/localized";
import { TeamCard } from "../TeamCard";

export function TeamSection({
  members,
  disciplines,
}: {
  members: TeamMemberCardData[];
  disciplines: Localized[];
}) {
  const t = useTranslations("team");
  const locale = useLocale();

  return (
    <section aria-labelledby="team-heading" className="section-y bg-mist">
      <Container>
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="flex flex-col gap-6">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 id="team-heading" className="text-h2">
              {t("heading")}
            </h2>
            <p className="max-w-lg text-muted">{t("text")}</p>
            <ArrowLink href="/about#leadership">{t("seeAll")}</ArrowLink>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {disciplines.map((d, i) => (
              <li key={i}>
                <Chip dot>{pick(d, locale)}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <li key={m.slug}>
              <Reveal delay={i * 100}>
                <TeamCard member={m} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
