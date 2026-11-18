import { useTranslations } from "next-intl";
import { Button } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { HeroStage } from "./HeroStage";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <HeroStage title={t("sceneLabel")}>
      <h1 className="text-display">
        {t("titleBefore")}{" "}
        <span className="relative inline-block whitespace-nowrap">
          <span className="relative z-10">{t("titleHighlight")}</span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[0.06em] z-0 h-[0.26em] bg-orange"
          />
        </span>
      </h1>
      <p className="max-w-lg text-ink/80">{t("description")}</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="dark" size="lg">
          <Link href="/projects">{t("ctaProjects")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/about">{t("ctaWho")}</Link>
        </Button>
      </div>
    </HeroStage>
  );
}
