import { useTranslations } from "next-intl";
import { LazyPhoto } from "@/components/ui/LazyPhoto";
import type { TeamMemberCardData } from "@/content/types";
import { cn } from "@/lib/utils";

/** Black-and-white portrait at 4:5, or an initials tile with "Photo coming soon" when there is no photo yet. */
export function TeamCard({
  member,
  large = false,
}: {
  member: TeamMemberCardData;
  /** Founders row: bigger name. */
  large?: boolean;
}) {
  const t = useTranslations("team");
  /** English titles and roles that have a Bangla translation in messages. */
  const label = (s: string) => {
    switch (s) {
      case "Co-founder":
        return t("coFounder");
      case "Head of Digital":
        return t("headOfDigital");
      case "Marketing Specialist":
        return t("marketingSpecialist");
      case "Graphic Designer":
        return t("graphicDesigner");
      default:
        return s;
    }
  };
  const showRole = member.role && !member.role.includes("TBC");

  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-mist">
        {member.photo ? (
          <LazyPhoto
            src={member.photo}
            alt={member.name}
            aspect="4/5"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            blur={member.photoBlur}
            className="absolute inset-0 h-full"
            imageClassName="grayscale"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-line bg-white">
            <span
              aria-hidden="true"
              className="font-heading text-[clamp(2.5rem,1.5rem+3vw,4rem)] font-semibold text-muted"
            >
              {member.initials}
            </span>
            <span className="text-small text-muted">{t("photoSoon")}</span>
          </div>
        )}
      </div>
      <div>
        {member.title && (
          <p className="mb-1 text-label font-medium tracking-wide text-orange-text uppercase">
            {label(member.title)}
          </p>
        )}
        <h3 className={large ? "text-h2" : "text-h3"}>{member.name}</h3>
        {showRole && (
          <p className={cn("mt-1 text-muted", !large && "text-small")}>{label(member.role)}</p>
        )}
      </div>
    </article>
  );
}
