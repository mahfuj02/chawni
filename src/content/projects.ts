// DUMMY DATA — replace with real content (see docs/CONTENT_GUIDE.md)
import type { Localized } from "@/lib/localized";
import type { ImageRef, Project, ProjectCategory } from "./types";

const CAPTIONS: Record<ProjectCategory, string[]> = {
  residential: [
    "HOUSE EXTERIOR",
    "LIVING ROOM",
    "KITCHEN AND DINING",
    "MASTER BEDROOM",
    "COURTYARD",
    "ROOF TERRACE",
  ],
  commercial: ["FAÇADE", "ENTRANCE LOBBY", "OPEN OFFICE", "MEETING ROOM", "ATRIUM", "NIGHT VIEW"],
  interior: [
    "FULL VIEW",
    "LIVING AREA",
    "JOINERY DETAIL",
    "LIGHTING DETAIL",
    "BEDROOM",
    "BATHROOM",
  ],
  construction: [
    "SITE OVERVIEW",
    "FOUNDATION WORKS",
    "STRUCTURAL FRAME",
    "BRICKWORK",
    "FINISHING",
    "HANDOVER DAY",
  ],
};

function images(category: ProjectCategory, titleEn: string, titleBn: string): ImageRef[] {
  return CAPTIONS[category].map((caption) => ({
    caption,
    alt: {
      en: `${titleEn}: ${caption.toLowerCase()} (placeholder)`,
      bn: `${titleBn}: ${caption.toLowerCase()} (নমুনা ছবি)`,
    } satisfies Localized,
  }));
}

function project(p: Omit<Project, "hero" | "gallery"> & { heroCaption?: string }): Project {
  const { heroCaption, ...rest } = p;
  const gallery = images(p.category, p.title.en, p.title.bn);
  return {
    ...rest,
    hero: { ...gallery[0], caption: heroCaption ?? gallery[0].caption },
    gallery,
  };
}

export const projects: Project[] = [
  project({
    slug: "courtyard-house",
    title: { en: "Courtyard House", bn: "কোর্টইয়ার্ড হাউস" },
    category: "residential",
    location: { en: "Dhaka", bn: "ঢাকা" },
    client: { en: "Private client", bn: "ব্যক্তিগত ক্লায়েন্ট" },
    year: 2024,
    sizeSqft: 4200,
    scope: { en: "Architecture, structure, construction", bn: "স্থাপত্য, কাঠামো, নির্মাণ" },
    status: "completed",
    summary: {
      en: "A family home organised around a shaded central courtyard.",
      bn: "ছায়াঘেরা কেন্দ্রীয় উঠান ঘিরে সাজানো একটি পারিবারিক বাড়ি।",
    },
    brief: {
      en: "A joint family needed private rooms for three generations, yet one shared place to gather. The plot is narrow and faces a busy road.",
      bn: "তিন প্রজন্মের একটি যৌথ পরিবারের জন্য আলাদা ঘর এবং একসঙ্গে বসার একটি জায়গা দরকার ছিল। জমিটি সরু এবং ব্যস্ত সড়কের মুখে।",
    },
    solution: {
      en: "Rooms wrap a courtyard that pulls in light and breeze, while a solid street façade keeps noise out. Deep verandas shade the walls from the summer sun.",
      bn: "ঘরগুলো একটি উঠান ঘিরে সাজানো, যা আলো-বাতাস আনে; সড়কমুখী দেয়াল শব্দ ঠেকায়। গভীর বারান্দা গ্রীষ্মের রোদ থেকে দেয়াল রক্ষা করে।",
    },
    quote: {
      text: {
        en: "The house feels calm from the first step inside. Placeholder quote.",
        bn: "ঢুকলেই বাড়িটা শান্ত লাগে। (নমুনা মন্তব্য)",
      },
      author: { en: "Client name, Dhaka", bn: "ক্লায়েন্টের নাম, ঢাকা" },
    },
    featured: true,
  }),
  project({
    slug: "riverside-residence",
    title: { en: "Riverside Residence", bn: "রিভারসাইড রেসিডেন্স" },
    category: "residential",
    location: { en: "Narayanganj", bn: "নারায়ণগঞ্জ" },
    client: { en: "Private client", bn: "ব্যক্তিগত ক্লায়েন্ট" },
    year: 2023,
    sizeSqft: 6800,
    scope: { en: "Design, engineering, construction", bn: "নকশা, প্রকৌশল, নির্মাণ" },
    status: "completed",
    summary: {
      en: "A duplex on the riverbank with long views and a flood-aware plinth.",
      bn: "নদীতীরের ডুপ্লেক্স, দীর্ঘ দৃশ্য ও বন্যা-সচেতন ভিত্তিসহ।",
    },
    brief: {
      en: "Build a calm weekend and family home facing the river, safe in the monsoon.",
      bn: "নদীমুখী একটি শান্ত পারিবারিক বাড়ি, বর্ষায়ও নিরাপদ।",
    },
    solution: {
      en: "A raised plinth, cantilevered upper floor and screened terraces keep the house dry, shaded and open to the water.",
      bn: "উঁচু ভিত্তি, ক্যান্টিলিভার দোতলা ও ঢাকা টেরেস বাড়িটিকে শুকনো, ছায়াযুক্ত এবং নদীমুখী রাখে।",
    },
    quote: {
      text: {
        en: "They solved problems we had not even noticed. Placeholder quote.",
        bn: "যে সমস্যা আমরা খেয়ালই করিনি, তারা সেটাও সমাধান করেছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Client name, Narayanganj", bn: "ক্লায়েন্টের নাম, নারায়ণগঞ্জ" },
    },
    featured: true,
  }),
  project({
    slug: "meridian-office",
    title: { en: "Meridian Office Tower", bn: "মেরিডিয়ান অফিস টাওয়ার" },
    category: "commercial",
    location: { en: "Gulshan, Dhaka", bn: "গুলশান, ঢাকা" },
    client: { en: "Meridian Holdings (placeholder)", bn: "মেরিডিয়ান হোল্ডিংস (নমুনা)" },
    year: 2024,
    sizeSqft: 58000,
    scope: { en: "Architecture, structure, MEP", bn: "স্থাপত্য, কাঠামো, এমইপি" },
    status: "completed",
    summary: {
      en: "A twelve-storey office block with efficient floor plates and a green podium.",
      bn: "বারো তলা অফিস ভবন, কার্যকর ফ্লোর প্লেট ও সবুজ পোডিয়ামসহ।",
    },
    brief: {
      en: "Maximise lettable area on a tight corner site while giving tenants daylight and a pleasant arrival.",
      bn: "সীমিত কোণার জমিতে ভাড়াযোগ্য এলাকা সর্বোচ্চ করা, সঙ্গে ভাড়াটিয়াদের জন্য দিনের আলো ও সুন্দর প্রবেশপথ।",
    },
    solution: {
      en: "A compact core, column-free floors and a planted podium create flexible offices with a welcoming street edge.",
      bn: "কমপ্যাক্ট কোর, স্তম্ভমুক্ত ফ্লোর ও গাছে সাজানো পোডিয়াম নমনীয় অফিস এবং আমন্ত্রণমূলক রাস্তার প্রান্ত তৈরি করেছে।",
    },
    quote: {
      text: {
        en: "Delivered on programme and on budget. Placeholder quote.",
        bn: "সময় ও বাজেটের মধ্যেই কাজ শেষ হয়েছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Client representative", bn: "ক্লায়েন্ট প্রতিনিধি" },
    },
    featured: true,
  }),
  project({
    slug: "market-square-retail",
    title: { en: "Market Square Retail", bn: "মার্কেট স্কয়ার রিটেইল" },
    category: "commercial",
    location: { en: "Chattogram", bn: "চট্টগ্রাম" },
    client: { en: "Market Square Ltd (placeholder)", bn: "মার্কেট স্কয়ার লিমিটেড (নমুনা)" },
    year: 2022,
    sizeSqft: 32000,
    scope: { en: "Design and construction management", bn: "নকশা ও নির্মাণ ব্যবস্থাপনা" },
    status: "completed",
    summary: {
      en: "A naturally ventilated retail arcade around a public square.",
      bn: "জনসমাগমের চত্বর ঘিরে প্রাকৃতিক বায়ু চলাচলের রিটেইল আর্কেড।",
    },
    brief: {
      en: "Create a shopping destination that stays comfortable without full air-conditioning.",
      bn: "পূর্ণ শীতাতপ ছাড়াই আরামদায়ক একটি কেনাকাটার গন্তব্য তৈরি করা।",
    },
    solution: {
      en: "Shaded arcades, stack ventilation and a central square reduce cooling loads and invite people to linger.",
      bn: "ছায়াযুক্ত আর্কেড, স্ট্যাক ভেন্টিলেশন ও কেন্দ্রীয় চত্বর শীতলীকরণের চাহিদা কমায় এবং মানুষকে সময় কাটাতে আমন্ত্রণ জানায়।",
    },
    quote: {
      text: {
        en: "Footfall exceeded our forecast. Placeholder quote.",
        bn: "পূর্বাভাসের চেয়ে বেশি মানুষ আসছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Client representative", bn: "ক্লায়েন্ট প্রতিনিধি" },
    },
    featured: false,
  }),
  project({
    slug: "loft-apartment",
    title: { en: "Loft Apartment", bn: "লফট অ্যাপার্টমেন্ট" },
    category: "interior",
    location: { en: "Banani, Dhaka", bn: "বনানী, ঢাকা" },
    client: { en: "Private client", bn: "ব্যক্তিগত ক্লায়েন্ট" },
    year: 2024,
    sizeSqft: 2100,
    scope: { en: "Interior design and fit-out", bn: "অভ্যন্তরীণ নকশা ও ফিট-আউট" },
    status: "completed",
    summary: {
      en: "A warm, compact apartment with joinery that does the work of three rooms.",
      bn: "উষ্ণ ও কমপ্যাক্ট অ্যাপার্টমেন্ট, যার জয়েনারি তিনটি ঘরের কাজ করে।",
    },
    brief: {
      en: "A young couple wanted an open, calm home with generous storage in a small footprint.",
      bn: "এক তরুণ দম্পতি ছোট জায়গায় খোলামেলা, শান্ত বাড়ি এবং পর্যাপ্ত সংরক্ষণ চেয়েছিলেন।",
    },
    solution: {
      en: "Full-height joinery hides storage, sliding panels reshape the plan, and layered lighting keeps the mood soft.",
      bn: "ছাদ-সমান জয়েনারি সংরক্ষণ লুকিয়ে রাখে, স্লাইডিং প্যানেল নকশা বদলে দেয়, স্তরযুক্ত আলো পরিবেশ নরম রাখে।",
    },
    quote: {
      text: {
        en: "Every corner has a purpose. Placeholder quote.",
        bn: "প্রতিটি কোণের একটা উদ্দেশ্য আছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Client name, Banani", bn: "ক্লায়েন্টের নাম, বনানী" },
    },
    featured: false,
  }),
  project({
    slug: "cafe-interior",
    title: { en: "Terrace Café", bn: "টেরেস ক্যাফে" },
    category: "interior",
    location: { en: "Sylhet", bn: "সিলেট" },
    client: { en: "Terrace Café (placeholder)", bn: "টেরেস ক্যাফে (নমুনা)" },
    year: 2023,
    sizeSqft: 1800,
    scope: { en: "Concept, interior design, joinery", bn: "ধারণা, অভ্যন্তরীণ নকশা, জয়েনারি" },
    status: "completed",
    summary: {
      en: "A tea-garden-inspired café with timber, cane and soft daylight.",
      bn: "চা-বাগান থেকে অনুপ্রাণিত ক্যাফে, কাঠ, বেত ও নরম দিনের আলোসহ।",
    },
    brief: {
      en: "Create a relaxed café that feels rooted in its region and works for both quick visits and long afternoons.",
      bn: "অঞ্চলের সঙ্গে সম্পৃক্ত একটি স্বস্তিদায়ক ক্যাফে, যেখানে দ্রুত চা এবং দীর্ঘ বিকেল দুটোই মানানসই।",
    },
    solution: {
      en: "Local timber, cane screens and a long daylight window zone separate quiet seating from the busy counter.",
      bn: "স্থানীয় কাঠ, বেতের পর্দা ও দীর্ঘ জানালা-অঞ্চল শান্ত বসার জায়গাকে ব্যস্ত কাউন্টার থেকে আলাদা করে।",
    },
    quote: {
      text: {
        en: "Guests ask who designed it every week. Placeholder quote.",
        bn: "প্রতি সপ্তাহে অতিথিরা জিজ্ঞেস করেন কে নকশা করেছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Owner, Terrace Café", bn: "মালিক, টেরেস ক্যাফে" },
    },
    featured: false,
  }),
  project({
    slug: "school-extension",
    title: { en: "Community School Extension", bn: "কমিউনিটি স্কুল সম্প্রসারণ" },
    category: "construction",
    location: { en: "Gazipur", bn: "গাজীপুর" },
    client: { en: "School trust (placeholder)", bn: "স্কুল ট্রাস্ট (নমুনা)" },
    year: 2023,
    sizeSqft: 14500,
    scope: { en: "Construction and site supervision", bn: "নির্মাণ ও সাইট তত্ত্বাবধান" },
    status: "completed",
    summary: {
      en: "Eight new classrooms built while the school stayed open.",
      bn: "স্কুল চালু থাকা অবস্থায় আটটি নতুন শ্রেণিকক্ষ নির্মাণ।",
    },
    brief: {
      en: "Add classrooms and a library on an operating campus with a strict summer-break window.",
      bn: "চালু ক্যাম্পাসে ক্লাসরুম ও লাইব্রেরি যোগ করা, গ্রীষ্মের ছুটির সীমিত সময়ের মধ্যে।",
    },
    solution: {
      en: "Phased works, pre-planned deliveries and strict site safety let the school open on time with the new wing ready.",
      bn: "ধাপে ধাপে কাজ, আগাম পরিকল্পিত সরবরাহ ও কঠোর নিরাপত্তা নিশ্চিত করেছে যে নতুন ভবনসহ স্কুল সময়মতো খুলেছে।",
    },
    quote: {
      text: {
        en: "Children moved in without losing a single week. Placeholder quote.",
        bn: "একটি সপ্তাহও না হারিয়ে শিশুরা নতুন ভবনে উঠেছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Headmaster", bn: "প্রধান শিক্ষক" },
    },
    featured: false,
  }),
  project({
    slug: "clinic-building",
    title: { en: "Neighbourhood Clinic", bn: "পাড়া ক্লিনিক" },
    category: "construction",
    location: { en: "Rajshahi", bn: "রাজশাহী" },
    client: { en: "Health foundation (placeholder)", bn: "স্বাস্থ্য ফাউন্ডেশন (নমুনা)" },
    year: 2025,
    sizeSqft: 9200,
    scope: { en: "Turnkey construction", bn: "টার্নকি নির্মাণ" },
    status: "ongoing",
    summary: {
      en: "A three-storey clinic with outpatient wards and diagnostics, now on site.",
      bn: "বহির্বিভাগ ও ডায়াগনস্টিকসহ তিন তলা ক্লিনিক, বর্তমানে নির্মাণাধীন।",
    },
    brief: {
      en: "Deliver a clean, durable clinic that is easy to maintain and ready for future expansion.",
      bn: "পরিচ্ছন্ন, টেকসই ও সহজে রক্ষণাবেক্ষণযোগ্য ক্লিনিক, ভবিষ্যৎ সম্প্রসারণের সুযোগসহ।",
    },
    solution: {
      en: "A simple structural grid, robust finishes and spare service shafts make the building efficient now and flexible later.",
      bn: "সরল কাঠামো গ্রিড, মজবুত ফিনিশিং ও অতিরিক্ত সার্ভিস শ্যাফট ভবনকে এখন কার্যকর এবং ভবিষ্যতে নমনীয় রাখে।",
    },
    quote: {
      text: {
        en: "Clear weekly reports gave us confidence throughout. Placeholder quote.",
        bn: "সাপ্তাহিক স্পষ্ট প্রতিবেদন আমাদের আস্থা দিয়েছে। (নমুনা মন্তব্য)",
      },
      author: { en: "Project manager, client side", bn: "প্রকল্প ব্যবস্থাপক, ক্লায়েন্টের পক্ষে" },
    },
    featured: false,
  }),
];

/**
 * While real models do not exist yet, every project shows the procedural demo building in
 * "Explore in 3D". Set to false once real GLB files are added: then only projects with a
 * `modelUrl` show the section.
 */
export const DEMO_MODELS = true;

export function hasModel(project: Project) {
  return Boolean(project.modelUrl) || DEMO_MODELS;
}
