"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { JOURNAL_CATEGORIES, type JournalCategory, type JournalPost } from "@/content/types";
import { Link } from "@/i18n/navigation";
import {
  JOURNAL_CATEGORY_KEY,
  filterByCategory,
  journalCategoryToSlug,
  parseJournalCategory,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import { PostCard } from "../PostCard";

const PAGE_SIZE = 3;

function JournalList({ posts }: { posts: JournalPost[] }) {
  const t = useTranslations("journalPage");
  const tc = useTranslations("common");
  const [shown, setShown] = useState(PAGE_SIZE);

  if (posts.length === 0) {
    return <p className="rounded-card bg-mist p-8 text-lg">{t("empty")}</p>;
  }

  const [featured, ...rest] = posts;
  const visible = rest.slice(0, shown);

  return (
    <div className="flex flex-col gap-14">
      <div>
        <p className="mb-4 text-label font-medium tracking-wide text-orange-text uppercase">
          {t("featured")}
        </p>
        <PostCard post={featured} featured headingLevel="h2" />
      </div>

      {visible.length > 0 && (
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}

      {shown < rest.length && (
        <div className="flex justify-center">
          <Button variant="outline" size="lg" onClick={() => setShown((n) => n + PAGE_SIZE)}>
            {tc("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}

export function JournalView({
  posts,
  category,
}: {
  posts: JournalPost[];
  category?: JournalCategory;
}) {
  const t = useTranslations("journalPage");
  const visible = filterByCategory(posts, category);
  const pill =
    "inline-flex min-h-11 items-center rounded-full border-2 px-5 text-[0.9375rem] font-semibold transition-colors";
  const on = "border-ink bg-ink text-white";
  const off = "border-line text-ink hover:border-ink";

  return (
    <div className="flex flex-col gap-10">
      <nav aria-label={t("filterLabel")}>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              href="/journal"
              scroll={false}
              aria-current={!category ? "true" : undefined}
              className={cn(pill, !category ? on : off)}
            >
              {t("all")}
            </Link>
          </li>
          {JOURNAL_CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                href={{ pathname: "/journal", query: { category: journalCategoryToSlug(c) } }}
                scroll={false}
                aria-current={category === c ? "true" : undefined}
                className={cn(pill, category === c ? on : off)}
              >
                {t(JOURNAL_CATEGORY_KEY[c])}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* key resets "load more" whenever the category changes */}
      <JournalList key={category ?? "all"} posts={visible} />
    </div>
  );
}

/** Reads `?category=` so filtered journal views can be shared. */
export function JournalExplorer({ posts }: { posts: JournalPost[] }) {
  const params = useSearchParams();
  const category = parseJournalCategory(params.get("category") ?? undefined);
  return <JournalView posts={posts} category={category} />;
}
