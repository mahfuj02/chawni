import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Container, Logo } from "@/components/ui";
import { company, telHref } from "@/content";
import { Link } from "@/i18n/navigation";
import { pick } from "@/lib/localized";
import { NAV_ITEMS } from "@/lib/nav";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const colTitle = "text-label mb-4 font-semibold tracking-wide text-white/60 uppercase";
  const link =
    "inline-flex min-h-11 items-center text-white/90 underline-offset-4 hover:text-white hover:underline";

  return (
    <footer className="on-dark bg-ink text-white">
      <Container className="section-y">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <Logo onDark width={132} />
            <p className="max-w-xs font-heading text-2xl leading-snug font-semibold">
              {pick(company.tagline, locale)}
            </p>
          </div>

          <nav aria-label={t("company")}>
            <h2 className={colTitle}>{t("company")}</h2>
            <ul>
              {NAV_ITEMS.filter((i) => i.key !== "home").map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={link}>
                    {tn(item.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className={link}>
                  {tn("contact")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={colTitle}>{t("office")}</h2>
            <address className="flex flex-col gap-1 text-white/90 not-italic">
              <p>{pick(company.address, locale)}</p>
              {company.phones.map((p) => (
                <a key={p} href={telHref(p)} className={link}>
                  {p}
                </a>
              ))}
              <a href={`mailto:${company.email}`} className={link}>
                {company.email}
              </a>
            </address>
          </div>

          {company.social.length > 0 && (
            <div>
              <h2 className={colTitle}>{t("follow")}</h2>
              <ul>
                {company.social.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                      {s.label}
                      <ArrowUpRight aria-hidden="true" className="ms-1 size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-8 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {locale === "bn" ? t("name") : company.name}. {t("rights")}
          </p>
          <p>
            {t("licences", {
              trade: company.registrations.tradeLicence,
              ieb: company.registrations.iebMembership,
              iab: company.registrations.iabMembership,
            })}
          </p>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
          >
            {t("privacy")}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
