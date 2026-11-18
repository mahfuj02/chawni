import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { getBlur } from "@/lib/blur";
import { JOURNAL_CATEGORIES, type JournalCategory, type JournalPost } from "@/content/types";

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

function isCategory(value: unknown): value is JournalCategory {
  return JOURNAL_CATEGORIES.includes(value as JournalCategory);
}

function toPost(slug: string, raw: string): JournalPost {
  const { data, content } = matter(raw);
  const category = isCategory(data.category) ? data.category : "News";
  return {
    slug,
    title: { en: String(data.title), bn: String(data.title_bn ?? data.title) },
    date: String(data.date),
    category,
    excerpt: { en: String(data.excerpt ?? ""), bn: String(data.excerpt_bn ?? data.excerpt ?? "") },
    cover: String(data.cover ?? ""),
    author: String(data.author ?? ""),
    coverBlur: getBlur(String(data.cover ?? "")),
    review: data.review === true,
    body: content,
  };
}

/** Read every MDX post from content/journal, newest first. */
export async function readPosts(): Promise<JournalPost[]> {
  const files = (await fs.readdir(JOURNAL_DIR)).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(JOURNAL_DIR, file), "utf8");
      return toPost(file.replace(/\.mdx$/, ""), raw);
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
