"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button, LanguageSwitcher, Logo } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Full-screen mobile menu (Radix Dialog: focus trap, Escape to close, scroll lock).
 * Loaded on demand by the header so the dialog code is not part of every page's initial JS.
 */
export default function MobileMenu({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const close = () => onOpenChange(false);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          data-lenis-prevent
          className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-white"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{t("mobile")}</Dialog.Title>
          <div className="px-gutter flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label="Chawni Architectures">
              <Logo compact onDark width={68} />
            </Link>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={tc("closeMenu")}
                className="inline-flex size-12 items-center justify-center rounded-full hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-7" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label={t("mobile")} className="px-gutter flex-1 py-8">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.key} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center font-heading text-3xl font-semibold",
                        active ? "text-orange" : "text-white",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-gutter flex flex-col gap-6 pb-10">
            <Button asChild size="lg">
              <Link href="/contact" onClick={close}>
                {t("contactUs")}
              </Link>
            </Button>
            <LanguageSwitcher onDark />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
