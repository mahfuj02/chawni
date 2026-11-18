import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { MdxBody } from "@/components/sections/journal/MdxBody";
import { ShareLinks } from "@/components/sections/journal/ShareLinks";
import { coverProps, PostCard } from "@/components/sections/PostCard";
import { Container, PlaceholderImage, SectionLabel } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getContentSource } from "@/lib/content-source";
import { JOURNAL_CATEGORY_KEY } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/jsonld";
import { pick } from "@/lib/localized";
import { absoluteUrl, localizedPath, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getContentSource().getPosts();
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getContentSource().getPost(slug);
  if (!post) return {};
  return pageMetadata({
    locale,
    path: `/journal/${slug}`,
    title: pick(post.title, locale),
    description: pick(post.excerpt, locale),
    type: "article",
    publishedTime: post.date,
  });
}

export default async function JournalPostPage({ params }: PageProps<"/[locale]/journal/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const content = getContentSource();
  const post = await content.getPost(slug);
  if (!post) notFound();
  const related = await content.getRelatedPosts(slug, 3);

  const t = await getTranslations("journalPage");
  const tn = await getTranslations("nav");
  const title = pick(post.title, locale);
  const cover = coverProps(post.cover);
  const url = absoluteUrl(localizedPath(locale, `/journal/${slug}`));

  return (
    <>
      <JsonLd data={articleJsonLd(post, locale)} />
      <article>
        <header className="section-y pb-10 md:pb-12">
          <Container className="flex max-w-3xl flex-col gap-6">
            <Link
              href="/journal"
              className="inline-flex min-h-11 w-fit items-center gap-2 text-small font-medium text-muted hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {tn("journal")}
            </Link>
            <SectionLabel>{t(JOURNAL_CATEGORY_KEY[post.category])}</SectionLabel>
            <h1 className="text-h2">{title}</h1>
            <p className="flex flex-wrap gap-x-4 text-small text-muted">
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span>{t("by", { author: post.author })}</span>
            </p>
          </Container>
        </header>

        <Container>
          <PlaceholderImage
            caption={cover.caption}
            src={cover.src}
            aspect="16/9"
            alt={title}
            sizes="100vw"
            priority
          />
        </Container>

        <Container className="section-y pt-12 md:pt-16">
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            {locale === "bn" && (
              <p className="rounded-card bg-mist p-4 text-sm" lang="en">
                {t("englishOnly")}
              </p>
            )}
            <div lang="en">
              <MdxBody source={post.body} />
            </div>
            <div className="border-t border-line pt-8">
              <ShareLinks url={url} title={title} />
            </div>
          </div>
        </Container>
      </article>

      <section aria-labelledby="related-heading" className="section-y bg-mist">
        <Container>
          <h2 id="related-heading" className="mb-12 text-h2">
            {t("related")}
          </h2>
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
