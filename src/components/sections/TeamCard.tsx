import { useTranslations } from "next-intl";
import { LazyPhoto } from "@/components/ui/LazyPhoto";
import { Reveal, SectionLabel } from "@/components/ui";
import type { TeamMemberCardData } from "@/content/types";

/** Titles that get the orange label style. */
const LABEL_TITLES = ["Co-founder", "Head of Digital"];

/** Black-and-white portrait at 4:5, or an initials tile with "Photo coming soon" when there is no photo yet. */
export function TeamCard({ member }: { member: TeamMemberCardData }) {
  const t = useTranslations("team");
  /** English titles and roles that have a Bangla translation in messages. */
  const label = (s: string) => {
    switch (s) {
      case "Co-founder":
        return t("coFounder");
      case "Head of Digital":
        return t("headOfDigital");
      case "Architecture":
        return t("architecture");
      case "Civil Engineer":
        return t("civilEngineer");
      case "Technology & client relations":
        return t("techClient");
      case "Brand & Visual Designer":
        return t("brandVisual");
      case "Marketing Specialist":
        return t("marketingSpecialist");
      default:
        return s;
    }
  };
  const hasTitle = member.title && LABEL_TITLES.includes(member.title);

  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-mist">
        {member.photo ? (
          <LazyPhoto
            src={member.photo}
            alt={member.name}
            aspect="4/5"
            sizes="(min-width:1024px) 320px, (min-width:640px) 45vw, 90vw"
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
        <h3 className="font-heading text-[20px] leading-tight font-semibold">{member.name}</h3>
        <p className="mt-1 text-[14px] text-muted">
          {hasTitle && (
            <>
              <span className="font-medium tracking-wide text-orange-text uppercase">
                {label(member.title!)}
              </span>
              {" · "}
            </>
          )}
          {label(member.role)}
        </p>
      </div>
    </article>
  );
}

/**
 * Three per row on desktop, two on tablet, one on phones, centred at 1040px. A last row that is not full
 * centres on desktop. The optional label sits above the first row only.
 */
export function TeamGrid({ members, label }: { members: TeamMemberCardData[]; label?: string }) {
  return (
    <div className="mx-auto w-full max-w-[1040px]">
      {label && <SectionLabel className="mb-6">{label}</SectionLabel>}
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:[&>li:last-child:nth-child(3n+1)]:col-start-2">
        {members.map((m, i) => (
          <li key={m.slug}>
            <Reveal delay={(i % 3) * 100}>
              <TeamCard member={m} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
