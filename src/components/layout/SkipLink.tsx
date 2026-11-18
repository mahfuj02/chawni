import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main"
      className="sr-only-focusable bg-orange text-ink focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:px-5 focus:py-3 focus:text-sm focus:font-semibold"
    >
      {t("skipToContent")}
    </a>
  );
}
