"use client";

import { useTranslations } from "next-intl";
import { Button, Container, SectionLabel } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section-y bg-sky text-ink">
      <Container className="flex min-h-[50vh] flex-col items-start justify-center gap-6">
        <SectionLabel>404</SectionLabel>
        <p
          aria-hidden="true"
          className="font-heading text-[clamp(6rem,3rem+14vw,16rem)] leading-none font-semibold"
        >
          404
        </p>
        <h1 className="max-w-3xl text-h2">{t("heading")}</h1>
        <p className="max-w-xl text-ink/80">{t("text")}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="dark" size="lg">
            <Link href="/">{t("home")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">{t("projects")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
