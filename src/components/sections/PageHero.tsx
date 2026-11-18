import type { ReactNode } from "react";
import { Breadcrumbs, Container, SectionLabel, type Crumb } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: ReactNode;
  text?: ReactNode;
  crumbs?: Crumb[];
  crumbsLabel?: string;
  tone?: "mist" | "white" | "dark";
  children?: ReactNode;
}

/** Hero block shared by inner pages. Exactly one h1 per page lives here. */
export function PageHero({
  label,
  title,
  text,
  crumbs,
  crumbsLabel = "Breadcrumb",
  tone = "mist",
  children,
}: PageHeroProps) {
  const dark = tone === "dark";
  return (
    <section
      className={cn(
        "section-y pb-12 md:pb-16",
        tone === "mist" && "bg-mist",
        tone === "white" && "bg-white",
        dark && "on-dark bg-ink text-white",
      )}
    >
      <Container className="flex flex-col gap-6">
        {crumbs && <Breadcrumbs items={crumbs} label={crumbsLabel} onDark={dark} />}
        <SectionLabel onDark={dark}>{label}</SectionLabel>
        <h1 className="max-w-5xl text-display">{title}</h1>
        {text && <p className={cn("max-w-2xl", dark ? "text-white/80" : "text-muted")}>{text}</p>}
        {children}
      </Container>
    </section>
  );
}
