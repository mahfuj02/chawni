// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { Phase, Sector } from "./types";

export const phases: Phase[] = [
  {
    key: "plan",
    number: "01",
    title: { en: "Plan", bn: "পরিকল্পনা" },
    description: {
      en: "We start with your site, budget and way of living, and turn them into a clear brief before a single line is drawn.",
      bn: "আপনার জমি, বাজেট ও জীবনযাত্রা বুঝে একটি স্পষ্ট ব্রিফ তৈরি করি, নকশা শুরুর আগেই।",
    },
    subServices: [
      { en: "Site analysis and survey", bn: "সাইট বিশ্লেষণ ও জরিপ" },
      { en: "Feasibility and budgeting", bn: "সম্ভাব্যতা যাচাই ও বাজেট" },
      { en: "Master planning", bn: "মাস্টার প্ল্যান" },
      { en: "Approvals and regulations", bn: "অনুমোদন ও বিধিমালা" },
    ],
  },
  {
    key: "design",
    number: "02",
    title: { en: "Design", bn: "নকশা" },
    description: {
      en: "Architecture and interiors that fit the climate, the family and the street, drawn with care and tested in 3D.",
      bn: "জলবায়ু, পরিবার ও পরিবেশের সঙ্গে মানানসই স্থাপত্য ও অভ্যন্তরীণ নকশা, থ্রিডিতে যাচাই করা।",
    },
    subServices: [
      { en: "Architectural design", bn: "স্থাপত্য নকশা" },
      { en: "Interior design", bn: "অভ্যন্তরীণ নকশা" },
      { en: "3D visualisation", bn: "থ্রিডি ভিজ্যুয়ালাইজেশন" },
      { en: "Landscape design", bn: "ল্যান্ডস্কেপ নকশা" },
    ],
  },
  {
    key: "engineer",
    number: "03",
    title: { en: "Engineer", bn: "প্রকৌশল" },
    description: {
      en: "Structure, services and detailing coordinated early, so what is drawn can be built safely and economically.",
      bn: "কাঠামো, সার্ভিস ও ডিটেইলিং শুরু থেকেই সমন্বয় করা হয়, যাতে নকশা নিরাপদে ও সাশ্রয়ীভাবে বাস্তবায়ন করা যায়।",
    },
    subServices: [
      { en: "Structural engineering", bn: "স্ট্রাকচারাল ইঞ্জিনিয়ারিং" },
      { en: "MEP engineering", bn: "এমইপি ইঞ্জিনিয়ারিং" },
      { en: "Soil testing and foundations", bn: "মাটি পরীক্ষা ও ভিত্তি" },
      { en: "Quantity surveying", bn: "পরিমাণ নিরূপণ" },
    ],
  },
  {
    key: "build",
    number: "04",
    title: { en: "Build", bn: "নির্মাণ" },
    description: {
      en: "Our own site teams deliver the project as drawn, with clear schedules, honest reporting and a careful handover.",
      bn: "আমাদের নিজস্ব সাইট টিম নকশা অনুযায়ী কাজ সম্পন্ন করে, স্পষ্ট সময়সূচি ও স্বচ্ছ প্রতিবেদনসহ।",
    },
    subServices: [
      { en: "Construction management", bn: "নির্মাণ ব্যবস্থাপনা" },
      { en: "Turnkey construction", bn: "টার্নকি নির্মাণ" },
      { en: "Site supervision and QA", bn: "সাইট তত্ত্বাবধান ও মান নিয়ন্ত্রণ" },
      { en: "Handover and maintenance", bn: "হস্তান্তর ও রক্ষণাবেক্ষণ" },
    ],
  },
];

export const sectors: Sector[] = [
  {
    key: "residential",
    title: { en: "Residential", bn: "আবাসিক" },
    description: {
      en: "Homes, duplexes and apartment buildings built around the way families live.",
      bn: "পরিবারের জীবনযাপনকে কেন্দ্র করে বাড়ি, ডুপ্লেক্স ও অ্যাপার্টমেন্ট ভবন।",
    },
  },
  {
    key: "commercial",
    title: { en: "Commercial", bn: "বাণিজ্যিক" },
    description: {
      en: "Offices, retail and mixed-use buildings that work hard for their owners.",
      bn: "অফিস, রিটেইল ও মিশ্র-ব্যবহারের ভবন, যা মালিকের জন্য মূল্য তৈরি করে।",
    },
  },
  {
    key: "hospitality",
    title: { en: "Hospitality", bn: "আতিথেয়তা" },
    description: {
      en: "Hotels, resorts and restaurants shaped around guest experience.",
      bn: "অতিথির অভিজ্ঞতা বিবেচনায় হোটেল, রিসোর্ট ও রেস্তোরাঁ।",
    },
  },
  {
    key: "institutional",
    title: { en: "Institutional", bn: "প্রাতিষ্ঠানিক" },
    description: {
      en: "Schools, clinics and community buildings designed to last for generations.",
      bn: "স্কুল, ক্লিনিক ও কমিউনিটি ভবন, যা প্রজন্মের পর প্রজন্ম টিকে থাকে।",
    },
  },
];
