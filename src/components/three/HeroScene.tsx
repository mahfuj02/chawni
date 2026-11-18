import { HeroFallback } from "./HeroFallback";

/** Hero 3D slot. Phase 6 replaces the static fallback with the lazy-loaded scene. */
export function HeroScene({ title }: { title: string }) {
  return <HeroFallback title={title} />;
}
