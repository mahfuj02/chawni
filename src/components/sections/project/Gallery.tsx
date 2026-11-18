"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { KeyboardEvent } from "react";
import { PlaceholderImage } from "@/components/ui";
import type { ImageRef } from "@/content/types";
import { pick } from "@/lib/localized";
import { pad2 } from "@/lib/utils";

interface GalleryProps {
  images: ImageRef[];
  /** Index of the open photo, or null when closed. Owned by the parent so 3D hotspots can open it. */
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
}

export function Gallery({ images, openIndex, onOpenChange }: GalleryProps) {
  const t = useTranslations("projectDetail");
  const locale = useLocale();
  const total = images.length;
  const open = openIndex !== null;
  const current = openIndex !== null ? images[openIndex] : null;

  const step = (delta: number) => {
    if (openIndex === null) return;
    onOpenChange((openIndex + delta + total) % total);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  const iconBtn =
    "inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink";

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {images.map((img, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onOpenChange(i)}
              aria-haspopup="dialog"
              title={t("openPhoto", { number: i + 1, total })}
              className="group block w-full overflow-hidden rounded-card text-start"
            >
              <span className="block transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
                <PlaceholderImage
                  caption={img.caption}
                  aspect="4/3"
                  src={img.src}
                  alt={pick(img.alt, locale)}
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open} onOpenChange={(o) => !o && onOpenChange(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink/95" />
          <Dialog.Content
            onKeyDown={onKeyDown}
            aria-describedby={undefined}
            className="on-dark fixed inset-0 z-[80] flex flex-col gap-4 p-4 text-white md:p-8"
          >
            <Dialog.Title className="sr-only">{t("gallery")}</Dialog.Title>
            <div className="flex items-center justify-between">
              <p className="font-heading text-xl tabular-nums" aria-live="polite">
                {current && (
                  <>
                    {pad2((openIndex ?? 0) + 1)} / {pad2(total)}
                  </>
                )}
              </p>
              <Dialog.Close className={iconBtn} aria-label={t("closeLightbox")}>
                <X aria-hidden="true" className="size-6" />
              </Dialog.Close>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center">
              {current && (
                <div className="w-full max-w-6xl">
                  <PlaceholderImage
                    caption={current.caption}
                    aspect="16/9"
                    src={current.src}
                    alt={pick(current.alt, locale)}
                    sizes="100vw"
                    priority
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("prevPhoto")}
                className={iconBtn}
              >
                <ChevronLeft aria-hidden="true" className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("nextPhoto")}
                className={iconBtn}
              >
                <ChevronRight aria-hidden="true" className="size-6" />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
