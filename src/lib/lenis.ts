import type Lenis from "lenis";

/**
 * Tiny module-level holder so other client code (ScrollTrigger scenes, dialogs)
 * can reach the Lenis instance without prop drilling. Null when smooth scroll is
 * disabled (reduced motion) or before mount.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}
