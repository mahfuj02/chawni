import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/content";

/** Floating WhatsApp shortcut, bottom right on every page. */
export function WhatsAppButton() {
  const t = useTranslations("common");
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappLabel")}
      className="fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-orange text-ink shadow-lg transition-transform duration-200 hover:scale-105 md:right-6 md:bottom-6"
    >
      <MessageCircle aria-hidden="true" className="size-7" />
    </a>
  );
}
