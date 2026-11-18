/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Fine for a single server instance. On serverless platforms each instance has its own
 * memory, so swap this for a shared store (Upstash/Redis) if abuse becomes a real problem.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    /** Returns true if the request is allowed, false if the key is over the limit. */
    check(key: string, now: number = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);

      // Opportunistic cleanup so the map cannot grow forever.
      if (hits.size > 5000) {
        for (const [k, times] of hits) {
          if (times.every((t) => now - t >= windowMs)) hits.delete(k);
        }
      }
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}
