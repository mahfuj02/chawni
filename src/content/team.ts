// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { Localized } from "@/lib/localized";
import type { TeamLeader } from "./types";

const bnNum = ["১", "২", "৩", "৪", "৫", "৬"];

function leader(n: number, role: Localized, qualification: Localized): TeamLeader {
  return {
    id: `team-member-${n}`,
    name: { en: `Team Member ${n}`, bn: `সদস্য ${bnNum[n - 1]}` },
    role,
    qualification,
    photo: {
      caption: `PORTRAIT ${n}`,
      alt: {
        en: `Portrait of Team Member ${n} (placeholder)`,
        bn: `সদস্য ${bnNum[n - 1]} এর ছবি (নমুনা)`,
      },
    },
  };
}

export const leaders: TeamLeader[] = [
  leader(
    1,
    { en: "Founding Principal Architect", bn: "প্রতিষ্ঠাতা প্রধান স্থপতি" },
    { en: "B.Arch, IAB member [TBC]", bn: "বি.আর্ক, আইএবি সদস্য [TBC]" },
  ),
  leader(
    2,
    { en: "Principal Structural Engineer", bn: "প্রধান স্ট্রাকচারাল প্রকৌশলী" },
    {
      en: "B.Sc. Civil Engineering, IEB member [TBC]",
      bn: "বি.এসসি সিভিল ইঞ্জিনিয়ারিং, আইইবি সদস্য [TBC]",
    },
  ),
  leader(
    3,
    { en: "Head of Interior Design", bn: "অভ্যন্তরীণ নকশা প্রধান" },
    { en: "B.Arch, Interior specialisation [TBC]", bn: "বি.আর্ক, ইন্টেরিয়র বিশেষায়ন [TBC]" },
  ),
  leader(
    4,
    { en: "Head of Construction", bn: "নির্মাণ প্রধান" },
    { en: "B.Sc. Civil Engineering [TBC]", bn: "বি.এসসি সিভিল ইঞ্জিনিয়ারিং [TBC]" },
  ),
  leader(
    5,
    { en: "MEP Engineering Lead", bn: "এমইপি ইঞ্জিনিয়ারিং লিড" },
    { en: "B.Sc. Mechanical Engineering [TBC]", bn: "বি.এসসি মেকানিক্যাল ইঞ্জিনিয়ারিং [TBC]" },
  ),
  leader(
    6,
    { en: "Operations and Client Manager", bn: "অপারেশনস ও ক্লায়েন্ট ম্যানেজার" },
    { en: "MBA, Project Management [TBC]", bn: "এমবিএ, প্রকল্প ব্যবস্থাপনা [TBC]" },
  ),
];

export const disciplines: Localized[] = [
  { en: "Architecture", bn: "স্থাপত্য" },
  { en: "Interior design", bn: "অভ্যন্তরীণ নকশা" },
  { en: "Structural engineering", bn: "স্ট্রাকচারাল প্রকৌশল" },
  { en: "MEP engineering", bn: "এমইপি প্রকৌশল" },
  { en: "Landscape", bn: "ল্যান্ডস্কেপ" },
  { en: "3D visualisation", bn: "থ্রিডি ভিজ্যুয়ালাইজেশন" },
  { en: "Quantity surveying", bn: "পরিমাণ নিরূপণ" },
  { en: "Construction management", bn: "নির্মাণ ব্যবস্থাপনা" },
  { en: "Site supervision", bn: "সাইট তত্ত্বাবধান" },
];
