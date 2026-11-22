import { Quote } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Container, SectionLabel } from "@/components/ui";
import type { Client } from "@/content/clients";
import type { Testimonial } from "@/content/types";
import { pick } from "@/lib/localized";
import { ClientStats } from "../clients/ClientStats";
import { ClientsMarquee } from "../clients/ClientsMarquee";

export function TrustedBy({
  testimonial,
  clients,
  projectCount,
}: {
  /** Optional: no real testimonial has been supplied yet. */
  testimonial?: Testimonial;
  clients: Client[];
  projectCount: number;
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
          <ClientStats projects={projectCount} />
        </div>

        {testimonial && (
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
        )}
      </Container>
      {/* Full width: the edge fade does the framing. */}
      <div className="mt-12">
        <ClientsMarquee clients={clients} />
      </div>
    </section>
  );
}
