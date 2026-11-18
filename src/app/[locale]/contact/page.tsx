import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button, Container, PlaceholderImage } from "@/components/ui";
import { company, whatsappUrl } from "@/content";
import { pick } from "@/lib/localized";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return pageMetadata({ locale, path: "/contact", title: t("title"), description: t("text") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");

  const details = [
    { Icon: MapPin, label: t("address"), value: pick(company.address, locale) },
    { Icon: Clock, label: t("hours"), value: pick(company.hours, locale) },
    {
      Icon: Phone,
      label: t("phone"),
      value: company.phone,
      href: `tel:${company.phone.replace(/[^+\d]/g, "")}`,
    },
    { Icon: Mail, label: t("email"), value: company.email, href: `mailto:${company.email}` },
  ];

  return (
    <>
      <PageHero
        label={t("label")}
        title={t("heading")}
        text={t("text")}
        crumbsLabel={tc("breadcrumb")}
        crumbs={[{ label: tn("home"), href: "/" }, { label: tn("contact") }]}
      />

      <section aria-label={t("title")} className="section-y pt-12 md:pt-16">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
              <h2 className="text-h3">{t("officeTitle")}</h2>
              <ul className="flex flex-col gap-6">
                {details.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-orange text-ink">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <dl>
                      <dt className="text-label font-medium tracking-wide text-muted uppercase">
                        {label}
                      </dt>
                      <dd className="mt-0.5">
                        {href ? (
                          <a href={href} className="underline-offset-4 hover:underline">
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-start gap-4 rounded-card bg-mist p-6 md:p-8">
              <h2 className="text-h3">{t("whatsappTitle")}</h2>
              <p className="text-muted">{t("whatsappText")}</p>
              <Button asChild>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" className="size-5" />
                  {t("whatsappButton")}
                </a>
              </Button>
            </div>
          </div>

          <ContactForm />
        </Container>
      </section>

      <section aria-labelledby="map-heading" className="pb-[var(--section-y)]">
        <Container className="flex flex-col gap-6">
          <h2 id="map-heading" className="text-h3">
            {t("mapTitle")}
          </h2>
          {/* Static stand-in until a real address exists; then swap for a Google Maps embed. */}
          <PlaceholderImage caption="MAP" aspect="21/9" alt={t("mapAlt")} className="min-h-56" />
          <p className="text-small text-muted">{t("mapNote")}</p>
        </Container>
      </section>
    </>
  );
}
