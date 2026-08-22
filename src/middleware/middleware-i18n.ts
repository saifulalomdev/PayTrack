import type { MiddlewareHandler } from "astro";
import {
  defaultLocale,
  isLocale,
} from "@/modules/i18n";

export const i18nMiddleware: MiddlewareHandler = async (
  { cookies, locals },
  next
) => {
  const cookieLocale = cookies.get("locale")?.value;

  locals.locale = isLocale(cookieLocale)
    ? cookieLocale
    : defaultLocale;

  return next();
};