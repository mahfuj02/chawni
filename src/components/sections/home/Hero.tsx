import { useTranslations } from "next-intl";
import { Button, Container } from "@/components/ui";
import { HeroScene } from "@/components/three/HeroScene";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="overflow-hidden bg-sky text-ink">
      <Container className="grid min-h-[calc(100svh-var(--header-h))] items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div className="flex flex-col items-start gap-8">
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
        </div>

        <div className="mx-auto aspect-square w-full max-w-[640px] lg:max-w-none">
          <HeroScene title={t("sceneLabel")} />
        </div>
      </Container>
    </section>
  );
}
