import { useLocale, useTranslations } from "next-intl";
import { ArrowLink, Card, Container, Reveal, SectionLabel, Stat } from "@/components/ui";
import type { StatItem } from "@/content/types";
import { pick } from "@/lib/localized";

export function WhoWeAre({ stats }: { stats: StatItem[] }) {
  const t = useTranslations("who");
  const locale = useLocale();

  return (
    <section aria-labelledby="who-heading" className="section-y">
      <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <Reveal className="flex flex-col items-start gap-6">
          <SectionLabel>{t("label")}</SectionLabel>
          <h2 id="who-heading" className="text-h2">
            {t("heading")}
          </h2>
          <p className="max-w-xl text-muted">{t("text")}</p>
          <ArrowLink href="/about">{t("more")}</ArrowLink>
        </Reveal>

        <ul className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <li key={s.key}>
              <Reveal delay={i * 80} className="h-full">
                <Card tone="mist" className="h-full">
                  <Stat
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals}
                    label={pick(s.label, locale)}
                  />
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
