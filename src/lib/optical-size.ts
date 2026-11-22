/**
 * Optical logo sizing: every logo gets about the same visual weight (area ≈ 6400 px²), so a round badge
 * and a long wordmark look equally heavy. Height is clamped to 24–72 px and width to at most 180 px.
 */
export function opticalSize(aspect: number): { width: number; height: number } {
  let h = Math.min(72, Math.max(24, Math.sqrt(6400 / aspect)));
  let w = h * aspect;
  if (w > 180) {
    w = 180;
    h = w / aspect;
  }
  return { width: Math.round(w), height: Math.round(h) };
}
