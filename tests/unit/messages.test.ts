import { describe, expect, it } from "vitest";
import bn from "../../messages/bn.json";
import en from "../../messages/en.json";

/** Flatten nested messages into "a.b.c" keys. */
function keys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object"
      ? keys(v as Record<string, unknown>, `${prefix}${k}.`)
      : [`${prefix}${k}`],
  );
}

function values(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((v) =>
    v && typeof v === "object" ? values(v as Record<string, unknown>) : [String(v)],
  );
}

describe("translations", () => {
  it("has the same keys in English and Bangla", () => {
    const enKeys = keys(en).sort();
    const bnKeys = keys(bn).sort();
    expect(bnKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
    expect(enKeys.filter((k) => !bnKeys.includes(k))).toEqual([]);
  });

  it("has no empty strings", () => {
    expect(values(en).filter((v) => v.trim() === "")).toEqual([]);
    expect(values(bn).filter((v) => v.trim() === "")).toEqual([]);
  });

  it("keeps the same ICU placeholders in both languages", () => {
    const placeholders = (s: string) => [...s.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();
    const flat = (o: Record<string, unknown>, p = ""): Record<string, string> =>
      Object.fromEntries(
        Object.entries(o).flatMap(([k, v]) =>
          v && typeof v === "object"
            ? Object.entries(flat(v as Record<string, unknown>, `${p}${k}.`))
            : [[`${p}${k}`, String(v)]],
        ),
      );
    const enFlat = flat(en);
    const bnFlat = flat(bn);
    for (const key of Object.keys(enFlat)) {
      expect({ key, vars: placeholders(bnFlat[key]) }).toEqual({
        key,
        vars: placeholders(enFlat[key]),
      });
    }
  });
});
