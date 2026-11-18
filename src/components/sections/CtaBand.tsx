import { useTranslations } from "next-intl";
import { Button, Container } from "@/components/ui";
import { whatsappUrl } from "@/content";
import { Link } from "@/i18n/navigation";

/** Orange call-to-action band used at the bottom of most pages. */
export function CtaBand() {
  const t = useTranslations("cta");
  return (
    <section aria-labelledby="cta-heading" className="on-orange bg-orange text-ink">
      <Container className="section-y flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <h2 id="cta-heading" className="max-w-3xl text-h2">
          {t("heading")} <span className="block">{t("sub")}</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="dark" size="lg">
            <Link href="/contact">{t("inquiry")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              {t("whatsapp")}
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
