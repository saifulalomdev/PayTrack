import { sequence } from "astro:middleware";
import { authMiddleware } from "./middleware.auth";
import { themeMiddleware } from "./middleware.theme";


export const onRequest = sequence(
  themeMiddleware,
  authMiddleware,
);