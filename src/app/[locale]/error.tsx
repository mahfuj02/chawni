"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button, Container, SectionLabel } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");
  const tn = useTranslations("notFound");

  useEffect(() => {
    // Real logging/monitoring (Sentry etc.) would hook in here.
    console.error(error);
  }, [error]);

  return (
    <section className="section-y bg-mist">
      <Container className="flex min-h-[50vh] flex-col items-start justify-center gap-6">
        <SectionLabel>{t("title")}</SectionLabel>
        <h1 className="max-w-3xl text-h2">{t("heading")}</h1>
        <p className="max-w-xl text-muted">{t("text")}</p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={reset}>
            {t("retry")}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">{tn("home")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
