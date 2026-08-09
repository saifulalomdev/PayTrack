import { getAuthenticatedStaff } from "@/utils/auth";
import type { MiddlewareHandler } from "astro";

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  // Resolve staff for EVERY request first — action handlers depend on
  // context.locals.staff via requireAuth/requireAdmin, so this must run
  // for /_actions calls too, not only page routes. Previously this was
  // skipped entirely for action calls, which meant every admin-gated
  // action always saw locals.staff === undefined and always failed.
  const staff = await getAuthenticatedStaff(context.cookies);
  context.locals.staff = staff;

  const isPublicPage = pathname === "/login";
  const isActionCall = pathname.startsWith("/_actions");
  const isPublicApi = pathname.startsWith("/api/register-admin");

  // Public routes and action calls proceed regardless of auth state here —
  // each action enforces its own requireAuth/requireAdmin check using the
  // locals.staff set above.
  if (isPublicPage || isActionCall || isPublicApi) {
    return next();
  }

  // Protect all other private page routes
  if (!staff) {
    return context.redirect("/login");
  }

  return next();
};