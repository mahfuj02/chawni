import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
export const SITE_NAME = "Chawni Architectures";

/** Path inside a locale: "/" stays "", "/about" stays "/about". */
export function localizedPath(locale: string, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

interface PageMetadataInput {
  locale: string;
  /** Path without locale, e.g. "/projects/courtyard-house". */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** Absolute or root-relative image. When omitted, the nearest opengraph-image route is used. */
  image?: string;
  publishedTime?: string;
}

/** Title, description, canonical, hreflang alternates, Open Graph and Twitter in one place. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
  image,
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(localizedPath(locale, path));
  const languages = Object.fromEntries(
    routing.locales.map((l: Locale) => [l, absoluteUrl(localizedPath(l, path))]),
  );
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        "x-default": absoluteUrl(localizedPath(routing.defaultLocale, path)),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "bn" ? "bn_BD" : "en_GB",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
