import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Text link with a trailing arrow, e.g. "More about us →". */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-[6px] hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-5 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
