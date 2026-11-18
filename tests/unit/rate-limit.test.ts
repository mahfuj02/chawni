import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit and then blocks", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect([1, 2, 3, 4].map(() => limiter.check("ip", 0))).toEqual([true, true, true, false]);
  });

  it("tracks each key separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 0)).toBe(true);
    expect(limiter.check("a", 0)).toBe(false);
  });

  it("lets requests through again once the window has passed", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 999)).toBe(false);
    expect(limiter.check("ip", 1000)).toBe(true);
  });

  it("does not count blocked requests against the window", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.check("ip", 0);
    limiter.check("ip", 500);
    expect(limiter.check("ip", 1000)).toBe(true);
  });

  it("can be reset", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.check("ip", 0);
    limiter.reset();
    expect(limiter.check("ip", 1)).toBe(true);
  });
});
