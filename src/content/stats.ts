// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { StatItem } from "./types";

export const stats: StatItem[] = [
  {
    key: "years",
    value: 10,
    suffix: "+",
    label: { en: "Years of practice", bn: "বছরের অভিজ্ঞতা" },
  },
  {
    key: "projects",
    value: 120,
    suffix: "+",
    label: { en: "Projects delivered", bn: "সম্পন্ন প্রকল্প" },
  },
  {
    key: "area",
    value: 1.2,
    suffix: "M",
    decimals: 1,
    label: { en: "Square feet built", bn: "বর্গফুট নির্মিত" },
  },
  {
    key: "team",
    value: 25,
    label: { en: "Professionals on the team", bn: "জন পেশাজীবী সদস্য" },
  },
];
