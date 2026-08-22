import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const localeActions = {
  setLocale: defineAction({
    accept: "json",

    input: z.object({
      locale: z.enum(["en", "bn"]),
    }),

    handler: async ({ locale }, context) => {
      context.cookies.set("locale", locale, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 365,
      });

      return {
        success: true,
        locale,
      };
    },
  }),
};