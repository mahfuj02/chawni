import { company } from "@/content";
import type { JournalPost, Project } from "@/content/types";
import { pick } from "@/lib/localized";
import { projectTitle } from "@/lib/project-text";
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
        telephone: [...company.phones],
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
        parentOrganization: { "@id": `${absoluteUrl("/")}#organization` },
      },
    ],
  };
}

/** CreativeWork for a project page, with the real cover photo. */
export function projectJsonLd(project: Project, locale: string) {
  return {
    "@context": CONTEXT,
    "@type": "CreativeWork",
    name: projectTitle(project, locale),
    description: project.summary,
    url: absoluteUrl(localizedPath(locale, `/projects/${project.slug}`)),
    inLanguage: locale,
    ...(project.year ? { dateCreated: project.year } : {}),
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    image: absoluteUrl(project.cover),
    genre: project.category,
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
    image: absoluteUrl(post.cover),
  };
}
