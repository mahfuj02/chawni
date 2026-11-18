"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button, LanguageSwitcher, Logo } from "@/components/ui";
import { Link, usePathname } from "@/i18n/navigation";
import { getLenis } from "@/lib/lenis";
import { NAV_ITEMS, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Sticky header. On Home the top of the page is the sky-blue hero, so the header
 * starts sky-coloured (light logo) and turns white with a hairline after scrolling.
 * Everywhere else it is white from the start (dark logo).
 */
export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Pause Lenis while the full-screen menu is open.
  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    return () => lenis?.start();
  }, [open]);

  const onSky = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[var(--header-h)] border-b transition-colors duration-300",
        onSky ? "border-transparent bg-sky" : "border-line bg-white",
        !scrolled && !open && "border-transparent",
      )}
    >
      <div className="px-gutter mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-6">
        <Link href="/" aria-label="Chawni Architectures" className="shrink-0">
          <Logo compact variant={onSky ? "light" : "dark"} width={68} priority />
        </Link>

        <nav aria-label={t("primary")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium transition-colors",
                      active ? "text-ink" : "text-ink/70 hover:text-ink",
                      active && "underline decoration-orange decoration-2 underline-offset-8",
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher className="hidden sm:flex" />
          <Button asChild className="hidden lg:inline-flex">
            <Link href="/contact">{t("contactUs")}</Link>
          </Button>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={tc("openMenu")}
                className="inline-flex size-12 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
              >
                <Menu aria-hidden="true" className="size-7" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content
                data-lenis-prevent
                className="on-dark fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink text-white"
                aria-describedby={undefined}
              >
                <Dialog.Title className="sr-only">{t("mobile")}</Dialog.Title>
                <div className="px-gutter flex h-[var(--header-h)] shrink-0 items-center justify-between">
                  <Link href="/" onClick={() => setOpen(false)} aria-label="Chawni Architectures">
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
                            onClick={() => setOpen(false)}
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
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      {t("contactUs")}
                    </Link>
                  </Button>
                  <LanguageSwitcher onDark />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
