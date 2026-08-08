import { defineMiddleware } from "astro:middleware";

export const themeMiddleware = defineMiddleware((context, next) => {
  const theme = context.cookies.get("theme")?.value === "dark" ? "dark" : "light";
  context.locals.theme = theme;
  return next();
});