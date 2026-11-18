import { company } from "@/content";
import type { JournalPost, Project } from "@/content/types";
import { pick } from "@/lib/localized";
import { SITE_NAME, absoluteUrl, localizedPath } from "@/lib/seo";

const CONTEXT = "https://schema.org";

/** Organization + LocalBusiness (GeneralContractor), used on the Home page. */
export function organizationJsonLd(locale: string) {
  const url = absoluteUrl(localizedPath(locale, "/"));
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: SITE_NAME,
        alternateName: company.nameBn,
        url,
        logo: absoluteUrl("/brand/icon-512.png"),
        slogan: pick(company.tagline, locale),
        sameAs: company.social.map((s) => s.href),
      },
      {
        "@type": ["LocalBusiness", "GeneralContractor"],
        "@id": `${absoluteUrl("/")}#localbusiness`,
        name: SITE_NAME,
        url,
        image: absoluteUrl("/brand/icon-512.png"),
        telephone: company.phone,
        email: company.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.address.en,
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: company.geo.latitude,
          longitude: company.geo.longitude,
        },
        openingHours: "Sa-Th 09:00-18:00",
        parentOrganization: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };
}

/** CreativeWork for a project page. */
export function projectJsonLd(project: Project, locale: string) {
  return {
    "@context": CONTEXT,
    "@type": "CreativeWork",
    name: pick(project.title, locale),
    description: pick(project.summary, locale),
    url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),
    inLanguage: locale,
    dateCreated: String(project.year),
    locationCreated: { "@type": "Place", name: pick(project.location, locale) },
    creator: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    ...(project.hero.src ? { image: absoluteUrl(project.hero.src) } : {}),
  };
}

/** Article for a journal post. */
export function articleJsonLd(post: JournalPost, locale: string) {
  const url = absoluteUrl(localizedPath(locale, `/journal/${post.slug}`));
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: pick(post.title, locale),
    description: pick(post.excerpt, locale),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    mainEntityOfPage: url,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/icon-512.png") },
    },
    ...(post.cover.startsWith("/") ? { image: absoluteUrl(post.cover) } : {}),
  };
}
