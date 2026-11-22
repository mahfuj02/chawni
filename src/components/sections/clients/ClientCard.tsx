import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Client } from "@/content/clients";
import { Link } from "@/i18n/navigation";
import { opticalSize } from "@/lib/optical-size";
import { cn } from "@/lib/utils";

const CARD =
  "group relative flex h-[132px] w-[220px] shrink-0 flex-col justify-between overflow-hidden rounded-[4px] border border-line bg-white p-4 text-left sm:h-[156px] sm:w-[260px] sm:p-5";
const LINK_STATE =
  "transition-colors duration-[250ms] hover:border-orange focus-visible:border-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

/**
 * One client. At rest the logo is the mono version at 70% opacity; on hover or keyboard focus the colour
 * version fades in (both images are stacked), the border turns orange, the Chawni watermark strengthens
 * and, if the client has a project, an arrow appears. `hidden` marks marquee duplicates.
 */
export function ClientCard({
  client,
  sector,
  hidden = false,
}: {
  client: Client;
  sector: string;
  hidden?: boolean;
}) {
  const size = client.aspect ? opticalSize(client.aspect) : null;
  const body = (
    <>
      <Image
        src="/brand/chawni-mark-dark.svg"
        alt=""
        width={120}
        height={120}
        unoptimized
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -bottom-5 size-[120px] opacity-[0.05] transition-opacity duration-[250ms] group-hover:opacity-10 group-focus-visible:opacity-10"
      />
      {client.projectSlug && (
        <ArrowUpRight
          aria-hidden="true"
          className="absolute top-3 right-3 size-4 text-orange opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}
      <div className="relative flex h-[68%] items-center justify-center">
        {size && client.logo && client.logoMono ? (
          <div
            className="relative max-sm:scale-[0.8]"
            style={{ width: size.width, height: size.height }}
          >
            <Image
              src={client.logoMono}
              alt=""
              width={size.width}
              height={size.height}
              unoptimized
              className="absolute inset-0 opacity-70 transition-opacity duration-[250ms] group-hover:opacity-0 group-focus-visible:opacity-0"
            />
            <Image
              src={client.logo}
              alt={client.name}
              width={size.width}
              height={size.height}
              unoptimized
              className="absolute inset-0 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100 group-focus-visible:opacity-100"
            />
          </div>
        ) : (
          <span className="text-center font-heading text-[18px] leading-snug font-semibold text-ink">
            {client.name}
          </span>
        )}
      </div>
      <div className="relative">
        {size && (
          // The logo's alt text already names the client for assistive tech.
          <p aria-hidden="true" className="text-[13px] leading-tight font-semibold text-ink">
            {client.name}
          </p>
        )}
        <p className="text-[12px] tracking-[0.02em] text-muted">{sector}</p>
      </div>
    </>
  );

  return client.projectSlug ? (
    <Link
      href={`/projects/${client.projectSlug}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(CARD, LINK_STATE)}
    >
      {body}
    </Link>
  ) : (
    <div aria-hidden={hidden || undefined} className={CARD}>
      {body}
    </div>
  );
}
