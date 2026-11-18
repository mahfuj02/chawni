"use client";

import { Check, Link2, MessageCircle, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const btn =
  "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-line px-4 text-small font-semibold transition-colors hover:border-ink";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const t = useTranslations("journalPage");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked (insecure context); the other share links still work.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-small font-medium text-muted">{t("share")}</span>
      <a
        className={btn}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("shareFacebook")}
      >
        <Share2 aria-hidden="true" className="size-4" />
        Facebook
      </a>
      <a
        className={btn}
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("shareWhatsapp")}
      >
        <MessageCircle aria-hidden="true" className="size-4" />
        WhatsApp
      </a>
      <button type="button" className={btn} onClick={copy}>
        {copied ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Link2 aria-hidden="true" className="size-4" />
        )}
        {copied ? t("linkCopied") : t("copyLink")}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("linkCopied") : ""}
      </span>
    </div>
  );
}
