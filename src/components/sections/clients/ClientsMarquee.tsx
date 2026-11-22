"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMediaQuery } from "@/components/three/useSceneGate";
import type { Client } from "@/content/clients";
import { pick } from "@/lib/localized";
import { ClientCard } from "./ClientCard";

/** Every sequence is repeated up to at least this many cards so it is wider than a large screen. */
const MIN_CARDS = 8;

/** Split alternately: even positions in row 1, odd in row 2. */
function splitRows(clients: Client[]): [Client[], Client[]] {
  return [clients.filter((_, i) => i % 2 === 0), clients.filter((_, i) => i % 2 === 1)];
}

/** Repeat a row until it has at least MIN_CARDS cards. */
function fill(row: Client[]): { client: Client; repeat: boolean }[] {
  const out: { client: Client; repeat: boolean }[] = [];
  if (row.length === 0) return out;
  for (let pass = 0; pass === 0 || out.length < MIN_CARDS; pass++) {
    for (const client of row) out.push({ client, repeat: pass > 0 });
  }
  return out;
}

/**
 * Two rows of client cards. Row 1 drifts right to left, row 2 left to right, on a duplicated track so the
 * loop is seamless. The duration is cards × a per-card time (set in CSS per breakpoint), so the speed is
 * the same however many clients there are. The section pauses on hover or focus. With reduced motion
 * it is a static wrapping grid. Duplicates are aria-hidden and not focusable.
 */
export function ClientsMarquee({ clients }: { clients: Client[] }) {
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const t = useTranslations("trusted");
  const locale = useLocale();

  if (reduce) {
    return (
      <ul aria-label={t("logos")} className="flex flex-wrap gap-4">
        {clients.map((c) => (
          <li key={c.slug}>
            <ClientCard client={c} sector={pick(c.sector, locale)} />
          </li>
        ))}
      </ul>
    );
  }

  const rows = splitRows(clients);
  return (
    <div role="group" aria-label={t("logos")} className="cm-section flex flex-col gap-4">
      {rows.map((row, r) => {
        const seq = fill(row);
        return (
          <div key={r} className="cm-row overflow-hidden">
            <ul
              className="cm-track"
              data-direction={r === 0 ? "rtl" : "ltr"}
              style={{ ["--n" as string]: seq.length }}
            >
              {[0, 1].flatMap((copy) =>
                seq.map(({ client, repeat }, i) => (
                  <li key={`${copy}-${i}`} data-client={client.slug}>
                    <ClientCard
                      client={client}
                      sector={pick(client.sector, locale)}
                      hidden={copy === 1 || repeat}
                    />
                  </li>
                )),
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
