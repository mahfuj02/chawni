export const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "projects", href: "/projects" },
  { key: "journal", href: "/journal" },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];

/** True when `pathname` (locale already stripped) belongs to the nav item. */
export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
