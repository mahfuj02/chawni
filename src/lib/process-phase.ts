export const PHASE_COUNT = 4;

/** Maps scroll progress through the phase list (0–1) to a phase index: four equal parts. */
export function phaseFromProgress(progress: number, count = PHASE_COUNT): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}
