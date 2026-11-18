import { Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Container, SectionLabel } from "@/components/ui";
import type { Client, Testimonial } from "@/content/types";
import { pick } from "@/lib/localized";

export function TrustedBy({
  testimonial,
  clients,
}: {
  testimonial: Testimonial;
  clients: Client[];
}) {
  const t = useTranslations("trusted");
  const locale = useLocale();

  return (
    <section aria-labelledby="trusted-heading" className="section-y">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-6">
          <SectionLabel>{t("label")}</SectionLabel>
          <h2 id="trusted-heading" className="text-h2">
            {t("heading")}
          </h2>
        </div>

        <figure className="flex flex-col gap-8 rounded-card bg-mist p-8 md:p-14">
          <Quote aria-hidden="true" className="size-12 text-orange" strokeWidth={1.5} />
          <blockquote className="max-w-4xl font-heading text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-snug font-semibold">
            {pick(testimonial.quote, locale)}
          </blockquote>
          <figcaption className="text-muted">
            <span className="font-semibold text-ink">{pick(testimonial.author, locale)}</span>
            {", "}
            {pick(testimonial.role, locale)}, {pick(testimonial.organization, locale)}
          </figcaption>
        </figure>

        <ul
          aria-label={t("logos")}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {clients.map((c) => (
            <li
              key={c.name}
              className="flex aspect-[3/2] items-center justify-center rounded-card border border-line p-4 text-center font-heading text-sm font-semibold text-muted"
            >
              {c.logo ? (
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={160}
                  height={80}
                  className="h-auto max-h-12 w-auto"
                />
              ) : (
                c.name
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
