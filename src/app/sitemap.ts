import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { absoluteUrl, localizedPath } from "@/lib/seo";

const STATIC_PATHS = ["/", "/about", "/services", "/projects", "/journal", "/contact", "/privacy"];

function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const alternates = {
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, absoluteUrl(localizedPath(l, path))]),
    ),
  };
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified,
    alternates,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = getContentSource();
  const [projects, posts] = await Promise.all([content.getProjects(), content.getPosts()]);

  return [
    ...STATIC_PATHS.flatMap((p) => entry(p)),
    ...projects.flatMap((p) => entry(`/projects/${p.slug}`)),
    ...posts.flatMap((p) => entry(`/journal/${p.slug}`, new Date(p.date))),
  ];
}
