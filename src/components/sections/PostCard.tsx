import { useLocale, useTranslations } from "next-intl";
import { PlaceholderImage } from "@/components/ui";
import type { JournalPost } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { JOURNAL_CATEGORY_KEY } from "@/lib/filters";
import { formatDate } from "@/lib/format";
import { pick } from "@/lib/localized";

/** `cover` is either a path under /public (starts with "/") or a placeholder caption. */
export function coverProps(cover: string) {
  return cover.startsWith("/") ? { src: cover, caption: "" } : { src: undefined, caption: cover };
}

export function PostCard({
  post,
  featured = false,
  headingLevel: Heading = "h3",
}: {
  post: JournalPost;
  featured?: boolean;
  /** Use "h2" where the card follows the page title directly (listing pages). */
  headingLevel?: "h2" | "h3";
}) {
  const locale = useLocale();
  const t = useTranslations("journalPage");
  const cover = coverProps(post.cover);
  const title = pick(post.title, locale);

  return (
    <article className="group relative flex flex-col gap-5">
      <div className="overflow-hidden rounded-card">
        <div className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
          <PlaceholderImage
            caption={cover.caption}
            src={cover.src}
            aspect={featured ? "16/9" : "3/2"}
            alt={title}
            sizes={
              featured
                ? "(min-width: 1024px) 66vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex flex-wrap items-center gap-x-3 text-small text-muted">
          <span className="font-medium text-orange-text">
            {t(JOURNAL_CATEGORY_KEY[post.category])}
          </span>
          <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
        </p>
        <Heading className={featured ? "text-h2" : "text-h3"}>
          <Link
            href={`/journal/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {title}
          </Link>
        </Heading>
        <p className="text-muted">{pick(post.excerpt, locale)}</p>
      </div>
    </article>
  );
}
