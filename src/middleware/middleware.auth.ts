import { getAuthenticatedStaff } from "@/utils/auth";
import type { MiddlewareHandler } from "astro";

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  // 1. Allow public pages and Astro Action API calls
  const isPublicPage = pathname === "/login";
  const isActionCall = pathname.startsWith("/_actions");

  if (isPublicPage || isActionCall) {
    return next();
  }

  // 2. Protect all other private routes
  const staff = await getAuthenticatedStaff(context.cookies);

  if (!staff) {
    return context.redirect("/login");
  }

  return next();
};