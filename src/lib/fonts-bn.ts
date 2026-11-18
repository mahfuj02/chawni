import { Hind_Siliguri } from "next/font/google";

/** Bangla pages: Hind Siliguri replaces both heading and body fonts. */
export const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-siliguri",
  display: "swap",
  // Not preloaded: English pages (the default) never need it, and it is six files. Bangla
  // pages fetch the subset on demand through @font-face.
  preload: false,
});
