import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Chawni Architectures journal";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const items = await getContentSource().getPosts();
  return routing.locales.flatMap((locale) => items.map((i) => ({ locale, slug: i.slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getContentSource().getPost(slug);
  return renderOgImage({
    title: post?.title.en ?? "Journal",
    kicker: post ? `journal · ${post.category}` : "journal",
  });
}
