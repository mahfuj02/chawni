import { useTranslations } from "next-intl";
import { STATUS_KEY, type ProjectStatus } from "@/content/types";
import { cn } from "@/lib/utils";

/** Small pill on the top-left of a project image: dark for Completed, white for everything else. */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const t = useTranslations("projectsPage.status");
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full px-3 text-[0.75rem] font-semibold tracking-wide",
        status === "Completed" ? "bg-ink text-white" : "bg-white text-ink",
        className,
      )}
    >
      {t(STATUS_KEY[status])}
    </span>
  );
}
