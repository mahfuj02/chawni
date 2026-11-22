// Client wall data. Logos: public/clients/<slug>.svg (colour) + <slug>-mono.svg (greyscale).
// aspect = logo width / height, used to size logos so they look optically equal.
// Clients without a logo yet render as a name card. Drop a logo in and set logo/mono/aspect.

import type { Testimonial } from "./types";

export type Client = {
  slug: string;
  name: string;
  sector: { en: string; bn: string };
  logo: string | null;
  logoMono: string | null;
  aspect: number | null;
  projectSlug?: string;
};

export const clients: Client[] = [
  {
    slug: "windsor-hotel",
    name: "Windsor Hotel",
    sector: { en: "Hospitality", bn: "আতিথেয়তা" },
    logo: "/clients/windsor-hotel.svg",
    logoMono: "/clients/windsor-hotel-mono.svg",
    aspect: 1.0,
    projectSlug: "windsor-hotel",
  },
  {
    slug: "team-consultancy-uk",
    name: "Team Consultancy UK",
    sector: { en: "Consultancy", bn: "কনসালটেন্সি" },
    logo: "/clients/team-consultancy-uk.svg",
    logoMono: "/clients/team-consultancy-uk-mono.svg",
    aspect: 1.0,
    projectSlug: "team-consultancy-uk",
  },
  {
    slug: "nirjhar-education",
    name: "Nirjhar Education",
    sector: { en: "Education", bn: "শিক্ষা" },
    logo: "/clients/nirjhar-education.svg",
    logoMono: "/clients/nirjhar-education-mono.svg",
    aspect: 3.589,
    projectSlug: "nirjhar-education",
  },
  {
    slug: "study-milestone",
    name: "Study Milestone",
    sector: { en: "Education", bn: "শিক্ষা" },
    logo: "/clients/study-milestone.svg",
    logoMono: "/clients/study-milestone-mono.svg",
    aspect: 1.046,
    projectSlug: "study-milestone",
  },
  {
    slug: "yes-academy",
    name: "YES Academy",
    sector: { en: "Education", bn: "শিক্ষা" },
    logo: "/clients/yes-academy.svg",
    logoMono: "/clients/yes-academy-mono.svg",
    aspect: 2.178,
    projectSlug: "yes-academy",
  },
  {
    slug: "zaman-associates",
    name: "Zaman Associates",
    sector: { en: "Professional services", bn: "পেশাদার সেবা" },
    logo: "/clients/zaman-associates.svg",
    logoMono: "/clients/zaman-associates-mono.svg",
    aspect: 7.454,
    projectSlug: "zaman-associates",
  },
  {
    slug: "hotel-paradise-inn",
    name: "Hotel Paradise Inn",
    sector: { en: "Hospitality", bn: "আতিথেয়তা" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "hotel-paradise-inn",
  },
  {
    slug: "spice-lobster",
    name: "Spice Lobster",
    sector: { en: "Restaurant", bn: "রেস্তোরাঁ" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "spice-lobster",
  },
  {
    slug: "gadget-zone",
    name: "Gadget Zone",
    sector: { en: "Retail", bn: "রিটেইল" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "gadget-zone",
  },
  {
    slug: "flyover-education",
    name: "Flyover Education",
    sector: { en: "Education", bn: "শিক্ষা" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "flyover-education",
  },
  {
    slug: "smh-global-education",
    name: "SMH Global Education",
    sector: { en: "Education", bn: "শিক্ষা" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "smh-global-education",
  },
  {
    slug: "helpline-travels",
    name: "Helpline Travels & Consultancy",
    sector: { en: "Travel & consultancy", bn: "ট্রাভেল ও কনসালটেন্সি" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "helpline-travels",
  },
  {
    slug: "dhalarpar-madrasa",
    name: "Dhalarpar Hafezia Madrasa",
    sector: { en: "Institutional", bn: "প্রতিষ্ঠান" },
    logo: null,
    logoMono: null,
    aspect: null,
    projectSlug: "dhalarpar-madrasa",
  },
];

/** No real testimonials have been supplied yet, so none are shown. */
export const testimonials: Testimonial[] = [];
