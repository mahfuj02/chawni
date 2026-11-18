import type { Locale } from "@/i18n/routing";

/** A string that exists in both site languages. */
export type Localized = Record<Locale, string>;

export function pick(value: Localized, locale: string): string {
  return value[locale as Locale] ?? value.en;
}
