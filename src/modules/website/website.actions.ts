import { createSiteSchema, updateSiteSchema } from "@/db/schema";
import { ActionError, defineAction } from "astro:actions";
import { siteRepository } from "./website.repository";
import { getDb } from "@/lib/get-db";
import { z } from "astro:schema";

const PROTECTED_SITE_IDS = [
    "cfb90e7b-64c1-4fdf-b412-f4eb8dbec7e9",
    "e05c0555-df01-4a78-8575-929b12c47920"
];

export const createSite = defineAction({
    accept: 'json',
    input: createSiteSchema as any,
    handler: async (input, context) => {
        const { env } = context.locals.runtime;

        const db = getDb(env);

        const newSite = await siteRepository.create(db, input);
        return { success: true, data: newSite };
    },
})

// UPDATE SITE
export const updateSite = defineAction({
    accept: 'json',
    input: updateSiteSchema as any,
    handler: async (input, context) => {
        const { id, ...data } = input;

        // Strict guard clause
        if (PROTECTED_SITE_IDS.includes(id)) {
            throw new ActionError({
                code: "FORBIDDEN",
                message: "This site is a protected system resource and cannot be updated.",
            });
        }
        const { env } = context.locals.runtime;
        const db = getDb(env);

        const updatedSite = await siteRepository.update(db, id, data);
        return { success: true, data: updatedSite };
    },
})

// DELETE SITE
export const deleteSite = defineAction({
    accept: 'json',
    input: z.object({ id: z.string() }),
    handler: async (input, context) => {

        if (PROTECTED_SITE_IDS.includes(input.id)) {
            throw new ActionError({
                code: "FORBIDDEN",
                message: "This site is a protected system resource and cannot be deleted.",
            });
        }
        const { env } = context.locals.runtime;
        const db = getDb(env);

        const deletedSite = await siteRepository.delete(db, input.id);
        return { success: true, data: deletedSite };
    },
})


export const verifyWebsiteTrackingScript = defineAction({
  accept: "json",
  input: z.object({
    url: z.string().url(),
    websiteId: z.string(),
  }),
  handler: async ({ url, websiteId }) => {

    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrackFlow-Verification-Bot/1.0",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: `Could not reach site. Server responded with status ${response.status}.`,
      });
    }

    const html = await response.text();

    const allowedDomains = [
      "localhost:3000",
      "tf.saifulalom.com",
      "trackflow.saifulalom.com",
    ]

    const hasScriptSrc = allowedDomains.some(domain => html.includes(`${domain}/script.js`));
    const hasWebsiteId = html.includes(`data-website-id="${websiteId}"`);

    const isVerified = hasScriptSrc && hasWebsiteId;

    if (isVerified) {
      return {
        success: isVerified,
        id: websiteId
      };
    }

    if (!hasScriptSrc) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Tracking script tag could not be found. Please ensure the script tag is added to your website's <head>.",
      });
    }

    if (!hasWebsiteId) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Script detected, but the 'data-website-id' attribute is missing or incorrect for this website.",
      });
    }
  },
});