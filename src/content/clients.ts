// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { Client, Testimonial } from "./types";

export const clients: Client[] = [
  { name: "Client One" },
  { name: "Client Two" },
  { name: "Client Three" },
  { name: "Client Four" },
  { name: "Client Five" },
  { name: "Client Six" },
];

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Chawni listened first, then designed. The building feels like it was made for us, and it was delivered exactly as drawn. (Placeholder testimonial)",
      bn: "চাউনি আগে শুনেছে, তারপর নকশা করেছে। ভবনটি যেন আমাদের জন্যই তৈরি, আর নকশা অনুযায়ীই হস্তান্তর হয়েছে। (নমুনা মন্তব্য)",
    },
    author: { en: "Client Name", bn: "ক্লায়েন্টের নাম" },
    role: { en: "Managing Director", bn: "ব্যবস্থাপনা পরিচালক" },
    organization: { en: "Organisation (placeholder)", bn: "প্রতিষ্ঠান (নমুনা)" },
  },
  {
    quote: {
      en: "Clear schedules, honest reports and no surprises on site. (Placeholder testimonial)",
      bn: "স্পষ্ট সময়সূচি, সৎ প্রতিবেদন এবং সাইটে কোনো চমক নেই। (নমুনা মন্তব্য)",
    },
    author: { en: "Client Name", bn: "ক্লায়েন্টের নাম" },
    role: { en: "Homeowner", bn: "বাড়ির মালিক" },
    organization: { en: "Dhaka", bn: "ঢাকা" },
  },
  {
    quote: {
      en: "One team for design, engineering and construction made everything simpler. (Placeholder testimonial)",
      bn: "নকশা, প্রকৌশল ও নির্মাণ একই দলের হাতে থাকায় সবকিছু সহজ হয়েছে। (নমুনা মন্তব্য)",
    },
    author: { en: "Client Name", bn: "ক্লায়েন্টের নাম" },
    role: { en: "Trustee", bn: "ট্রাস্টি" },
    organization: { en: "Foundation (placeholder)", bn: "ফাউন্ডেশন (নমুনা)" },
  },
];
