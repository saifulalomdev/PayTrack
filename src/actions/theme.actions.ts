// src/actions/theme.actions.ts
import { defineAction } from "astro:actions";
import { z } from "zod";

export const themeActions = {
  setTheme: defineAction({
    input: z.object({
      theme: z.enum(["light", "dark"]),
    }),
    handler: async (input, context) => {
      context.cookies.set("theme", input.theme, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
      });
      return { theme: input.theme };
    },
  }),
};