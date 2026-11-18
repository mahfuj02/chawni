"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = { en: "EN", bn: "বাংলা" };
// Accessible names must contain the visible text (WCAG 2.5.3 Label in Name).
const LANG_NAME: Record<string, string> = { en: "EN, English", bn: "বাংলা" };

export function LanguageSwitcher({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const active = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <nav aria-label={t("language")} className={cn("flex items-center", className)}>
      {routing.locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              aria-hidden="true"
              className={cn("mx-0.5", onDark ? "text-white/40" : "text-muted/50")}
            >
              |
            </span>
          )}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-current={locale === active ? "true" : undefined}
            aria-label={LANG_NAME[locale]}
            className={cn(
              "inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-small font-medium transition-colors",
              locale === active
                ? onDark
                  ? "text-white"
                  : "text-ink"
                : onDark
                  ? "text-white/70 hover:text-white"
                  : "text-ink/75 hover:text-ink",
            )}
          >
            {LABEL[locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
