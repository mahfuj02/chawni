import { PencilRuler, ShieldCheck, Hammer } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, Container, Reveal, SectionLabel } from "@/components/ui";

const PILLARS = [
  { key: "care", Icon: PencilRuler },
  { key: "engineered", Icon: ShieldCheck },
  { key: "built", Icon: Hammer },
] as const;

export function WhyChawni() {
  const t = useTranslations("why");

  return (
    <section aria-labelledby="why-heading" className="section-y bg-mist">
      <Container>
        <div className="mb-12 flex max-w-3xl flex-col gap-6">
          <SectionLabel>{t("label")}</SectionLabel>
          <h2 id="why-heading" className="text-h2">
            {t("heading")}
          </h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {PILLARS.map(({ key, Icon }, i) => (
            <li key={key}>
              <Reveal delay={i * 100} className="h-full">
                <Card className="flex h-full flex-col gap-5">
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-orange text-ink">
                    <Icon aria-hidden="true" className="size-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-h3">{t(`${key}.title`)}</h3>
                  <p className="text-muted">{t(`${key}.text`)}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
