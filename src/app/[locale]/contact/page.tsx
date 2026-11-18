import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/PageHero";
import { Button, Container, PlaceholderImage } from "@/components/ui";
import { company, telHref, whatsappUrl } from "@/content";
import { pick } from "@/lib/localized";
import { pageMetadata } from "@/lib/seo";

// Code-split: the form pulls in react-hook-form and zod, which no other page needs.
// It still server-renders, so the form is in the HTML.
const ContactForm = dynamic(() =>
  import("@/components/forms/ContactForm").then((m) => m.ContactForm),
);

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
    {
      Icon: MapPin,
      label: t("address"),
      lines: [{ text: pick(company.address, locale) }] as { text: string; href?: string }[],
    },
    {
      Icon: Phone,
      label: t("phone"),
      lines: company.phones.map((p) => ({ text: p, href: telHref(p) })),
    },
    {
      Icon: Mail,
      label: t("email"),
      lines: [{ text: company.email, href: `mailto:${company.email}` }],
    },
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
                {details.map(({ Icon, label, lines }) => (
                  <li key={label} className="flex items-start gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-orange text-ink">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <dl>
                      <dt className="text-label font-medium tracking-wide text-muted uppercase">
                        {label}
                      </dt>
                      <dd className="mt-0.5 flex flex-col">
                        {lines.map((line) =>
                          line.href ? (
                            <a
                              key={line.text}
                              href={line.href}
                              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                            >
                              {line.text}
                            </a>
                          ) : (
                            <span key={line.text}>{line.text}</span>
                          ),
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
