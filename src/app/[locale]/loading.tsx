"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui";

/** Skeleton shown while a route segment loads. */
export default function Loading() {
  const t = useTranslations("common");
  return (
    <div role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("loading")}</span>
      <section className="section-y bg-mist">
        <Container className="flex flex-col gap-5">
          <div className="h-4 w-28 animate-pulse rounded bg-line" />
          <div className="h-16 w-full max-w-3xl animate-pulse rounded bg-line" />
          <div className="h-16 w-2/3 max-w-2xl animate-pulse rounded bg-line" />
        </Container>
      </section>
      <Container className="section-y grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[4/3] animate-pulse rounded bg-line" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-line" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-line" />
          </div>
        ))}
      </Container>
    </div>
  );
}
