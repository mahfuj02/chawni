import { Inter, Sora } from "next/font/google";

/** English pages: Sora for headings, Inter (variable, all weights in one file) for body. */
export const sora = Sora({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-sora",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
