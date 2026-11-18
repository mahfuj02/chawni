// Real contact details (office street address still to be confirmed: see docs/HANDOVER.md).
import type { Localized } from "@/lib/localized";

export const company = {
  name: "Chawni Architectures",
  nameBn: "ছাউনি",
  fullNameBn: "ছাউনি — স্থাপত্য প্রকৌশল",
  tagline: {
    en: "For an environment to live.",
    bn: "পরিবেশের জন্য বাস করার মতো।",
  } satisfies Localized,
  address: {
    en: "[TBC], Sylhet, Bangladesh",
    bn: "[TBC], সিলেট, বাংলাদেশ",
  } satisfies Localized,
  phones: ["+880 1714 912091", "+880 1738 572355"],
  email: "chawnimn@gmail.com",
  /** International format, digits only (used for wa.me links): the first phone. */
  whatsapp: "8801714912091",
  /** Social profiles: add { key, label, href } entries when the studio shares them. */
  social: [] as { key: string; label: string; href: string }[],
  registrations: {
    tradeLicence: "[TBC]",
    iebMembership: "[TBC]",
    iabMembership: "[TBC]",
  },
  /** Approximate centre of Sylhet until the exact office location is known. */
  geo: { latitude: 24.8949, longitude: 91.8687 },
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
