import { useTranslations } from "next-intl";
import { LazyPhoto } from "@/components/ui/LazyPhoto";
import type { TeamMemberCardData } from "@/content/types";

/** Black-and-white portrait at 4:5, or an initials tile when there is no photo yet. */
export function TeamCard({ member }: { member: TeamMemberCardData }) {
  const t = useTranslations("team");
  const showRole = member.role && !member.role.includes("TBC");

  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-mist">
        {member.photo ? (
          <LazyPhoto
            src={member.photo}
            alt={member.name}
            aspect="4/5"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            blur={member.photoBlur}
            className="absolute inset-0 h-full"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-placeholder">
            <span
              aria-hidden="true"
              className="font-heading text-[clamp(4rem,3rem+4vw,7rem)] leading-none font-semibold text-ink/80"
            >
              {member.initials}
            </span>
            <span className="text-label font-medium tracking-wide text-placeholder-ink uppercase">
              {t("photoSoon")}
            </span>
          </div>
        )}
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
