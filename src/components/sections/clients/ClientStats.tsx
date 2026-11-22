import { useLocale, useTranslations } from "next-intl";
import { clients } from "@/content/clients";
import { CountUp } from "./CountUp";

/** Projects come from the project data; clients and sectors are derived from clients.ts. */
export function ClientStats({ projects }: { projects: number }) {
  const t = useTranslations("trusted");
  const locale = useLocale();
  const sectors = new Set(clients.map((c) => c.sector.en)).size;
  const items = [
    { value: projects, suffix: "+", label: t("statProjects") },
    { value: clients.length, suffix: "", label: t("statClients") },
    { value: sectors, suffix: "", label: t("statSectors") },
  ];
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-4">
      {items.map((s) => (
        <div key={s.label} className="flex items-baseline gap-3">
          <dt className="order-2 text-muted">{s.label}</dt>
          <dd className="font-heading text-[clamp(1.75rem,1.2rem+1.5vw,2.5rem)] leading-none font-semibold">
            <CountUp value={s.value} locale={locale} suffix={s.suffix} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
