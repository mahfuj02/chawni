import { useTranslations } from "next-intl";
import { LazyPhoto } from "@/components/ui/LazyPhoto";
import type { TeamMemberCardData } from "@/content/types";

/** Black-and-white portrait at 4:5. Only members who have a photo get a card (see TeamNameList). */
export function TeamCard({ member }: { member: TeamMemberCardData }) {
  const t = useTranslations("team");
  const showRole = member.role && !member.role.includes("TBC");

  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-mist">
        <LazyPhoto
          src={member.photo ?? ""}
          alt={member.name}
          aspect="4/5"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          blur={member.photoBlur}
          className="absolute inset-0 h-full"
          imageClassName="grayscale"
        />
      </div>
      <div>
        {member.title && (
          <p className="mb-1 text-label font-medium tracking-wide text-orange-text uppercase">
            {member.title === "Co-founder" ? t("coFounder") : member.title}
          </p>
        )}
        <h3 className="text-h3">{member.name}</h3>
        {showRole && <p className="mt-1 text-muted">{member.role}</p>}
      </div>
    </article>
  );
}

/** Team members who do not have a portrait yet: names and roles only, no placeholder tile. */
export function TeamNameList({ members }: { members: TeamMemberCardData[] }) {
  const t = useTranslations("team");
  if (members.length === 0) return null;
  return (
    <div className="mt-16 border-t border-line pt-8">
      <h3 className="text-h3">{t("alsoTitle")}</h3>
      <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <li key={m.slug}>
            <span className="font-medium">{m.name}</span>
            {m.role && !m.role.includes("TBC") && <span className="text-muted"> · {m.role}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
