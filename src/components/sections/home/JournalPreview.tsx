import { useTranslations } from "next-intl";
import { ArrowLink, Container, Reveal, SectionLabel } from "@/components/ui";
import type { JournalPost } from "@/content/types";
import { PostCard } from "../PostCard";

export function JournalPreview({ posts }: { posts: JournalPost[] }) {
  const t = useTranslations("journalSection");

  return (
    <section aria-labelledby="journal-heading" className="section-y bg-mist">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-6">
            <SectionLabel>{t("label")}</SectionLabel>
            <h2 id="journal-heading" className="text-h2">
              {t("heading")}
            </h2>
          </div>
          <ArrowLink href="/journal">{t("seeAll")}</ArrowLink>
        </div>
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 100}>
                <PostCard post={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
