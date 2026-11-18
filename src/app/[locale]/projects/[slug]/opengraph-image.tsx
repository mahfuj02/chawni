import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Chawni Architectures project";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const items = await getContentSource().getProjects();
  return routing.locales.flatMap((locale) => items.map((i) => ({ locale, slug: i.slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getContentSource().getProject(slug);
  const cover = project?.images.find((i) => i.src === project.cover) ?? project?.images[0];
  return renderOgImage({
    title: project?.title ?? "Project",
    kicker: project ? `${project.category} · ${project.location}` : "projects",
    photo: cover?.thumb,
  });
}
