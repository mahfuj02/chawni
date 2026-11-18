/** Format an ISO date (YYYY-MM-DD) for the given site locale. */
export function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** Format a number using the locale's digits (Bangla digits for bn). */
export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(value);
}
