// REAL TEAM DATA — photos in public/team (the site uses the black-and-white *-bw.jpg).
// Order matters: About and Home show members in this order.
import type { TeamMember } from "./types";

export const team: TeamMember[] = [
  {
    slug: "najir-hridoy",
    name: "Engr. Najir Hridoy",
    title: "Co-founder",
    role: "Architecture",
    photo: "/team/najir-hridoy-bw.jpg",
    photoColor: "/team/najir-hridoy.jpg",
    initials: "NH",
  },
  {
    slug: "masum-parvez",
    name: "Engr. Masum Parvez",
    title: "Co-founder",
    role: "Civil Engineer",
    photo: "/team/masum-parvez-bw.jpg",
    photoColor: "/team/masum-parvez.jpg",
    initials: "MP",
  },
  {
    slug: "mahfuj-ahmed",
    name: "Md Mahfuj Ahmed",
    title: "Head of Digital",
    role: "Technology & client relations",
    photo: "/team/mahfuj-ahmed-bw.jpg",
    photoColor: "/team/mahfuj-ahmed.jpg",
    initials: "MA",
  },
  {
    slug: "jahid-hasan",
    name: "Jahid Hasan",
    role: "Brand & Visual Designer",
    photo: "/team/jahid-hasan-bw.jpg",
    photoColor: "/team/jahid-hasan.jpg",
    initials: "JH",
  },
  { slug: "shitol-ahmed", name: "Engr. Shitol Ahmed", role: "Civil Engineer", initials: "SA" },
  { slug: "mahjan-prova", name: "Engr. Mahjan Prova", role: "Architecture", initials: "MP" },
  {
    slug: "tofayel-ahmed",
    name: "Tofayel Ahmed",
    role: "Marketing Specialist",
    photo: "/team/tofayel-ahmed-bw.jpg",
    photoColor: "/team/tofayel-ahmed.jpg",
    initials: "TA",
  },
];
