"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { KeyboardEvent } from "react";
import type { ProjectImage } from "@/content/types";
import { pad2 } from "@/lib/utils";

interface GalleryProps {
  images: ProjectImage[];
  /** Index of the open photo, or null when closed. Owned by the parent so 3D hotspots can open it. */
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
}

/** Masonry-style grid of 1200 px photos (natural aspect ratios) plus a lightbox with a counter. */
export function Gallery({ images, openIndex, onOpenChange }: GalleryProps) {
  const t = useTranslations("projectDetail");
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
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4">
        {images.map((img, i) => (
          <li key={img.src} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => onOpenChange(i)}
              aria-haspopup="dialog"
              title={t("openPhoto", { number: i + 1, total })}
              className="group block w-full overflow-hidden rounded-card bg-placeholder text-start"
            >
              <Image
                src={img.thumb}
                alt={img.alt}
                width={1200}
                height={Math.round((1200 * img.height) / img.width)}
                sizes="(min-width: 1280px) 420px, (min-width: 768px) 33vw, 50vw"
                placeholder={img.blur ? "blur" : "empty"}
                blurDataURL={img.blur}
                className="h-auto w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
              />
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

            {/* The frame fills the free height; the photo is contained, never cropped or covering controls. */}
            <div className="relative min-h-0 flex-1">
              {current && (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                />
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
