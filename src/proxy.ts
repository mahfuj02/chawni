import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16 renamed "middleware" to "proxy". next-intl's handler works unchanged.
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes and any path with a file extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
