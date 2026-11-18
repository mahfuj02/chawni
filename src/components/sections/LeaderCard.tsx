import { useLocale } from "next-intl";
import { PlaceholderImage } from "@/components/ui";
import type { TeamLeader } from "@/content/types";
import { pick } from "@/lib/localized";

export function LeaderCard({ leader }: { leader: TeamLeader }) {
  const locale = useLocale();
  return (
    <article className="flex flex-col gap-4">
      <PlaceholderImage
        caption={leader.photo?.caption ?? "PORTRAIT"}
        aspect="4/5"
        src={leader.photo?.src}
        alt={leader.photo ? pick(leader.photo.alt, locale) : pick(leader.name, locale)}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
      />
      <div>
        <h3 className="text-h3">{pick(leader.name, locale)}</h3>
        <p className="mt-1 font-medium">{pick(leader.role, locale)}</p>
        <p className="mt-0.5 text-small text-muted">{pick(leader.qualification, locale)}</p>
      </div>
    </article>
  );
}
