// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { Localized } from "@/lib/localized";

export const company = {
  name: "Chawni Architectures",
  nameBn: "চাউনি",
  fullNameBn: "চাউনি — স্থাপত্য প্রকৌশল",
  tagline: {
    en: "For an environment to live.",
    bn: "পরিবেশের জন্য বাস করার মতো।",
  } satisfies Localized,
  address: {
    en: "House 00, Road 00, Block A, Dhaka 1200 (placeholder)",
    bn: "বাড়ি ০০, সড়ক ০০, ব্লক এ, ঢাকা ১২০০ (নমুনা ঠিকানা)",
  } satisfies Localized,
  hours: {
    en: "Sat – Thu, 9:00 am – 6:00 pm",
    bn: "শনি – বৃহস্পতি, সকাল ৯টা – সন্ধ্যা ৬টা",
  } satisfies Localized,
  phone: "+880 1700-000000",
  email: "hello@chawni.example",
  /** International format, digits only (used for wa.me links). */
  whatsapp: "8801700000000",
  social: [
    { key: "facebook", label: "Facebook", href: "https://facebook.com/" },
    { key: "linkedin", label: "LinkedIn", href: "https://linkedin.com/" },
    { key: "instagram", label: "Instagram", href: "https://instagram.com/" },
    { key: "youtube", label: "YouTube", href: "https://youtube.com/" },
  ],
  registrations: {
    tradeLicence: "[TBC]",
    iebMembership: "[TBC]",
    iabMembership: "[TBC]",
  },
  geo: { latitude: 23.8103, longitude: 90.4125 },
} as const;

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
