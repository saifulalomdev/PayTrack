import { sequence } from "astro:middleware";
import { authMiddleware } from "./middleware-auth";
import { themeMiddleware } from "./middleware-theme";
import { i18nMiddleware } from "./middleware-i18n";


export const onRequest = sequence(
  themeMiddleware,
  authMiddleware,
  i18nMiddleware
);