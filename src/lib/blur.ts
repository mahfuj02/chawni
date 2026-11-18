import "server-only";
import blur from "@/content/blur.json";

const map = blur as Record<string, string>;

/** Tiny base64 placeholder for a public image path, if one was generated (pnpm content:blur). */
export function getBlur(src: string | undefined): string | undefined {
  return src ? map[src] : undefined;
}
