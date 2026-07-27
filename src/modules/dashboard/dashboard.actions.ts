// src/actions/dashboard.ts

import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { dashboardService } from "./dashboard.service";
import { getDb } from "@/lib";

export const dashboardActions = {
    getOverview: defineAction({
        input: z.object({
            websiteId: z.string().optional(),
            dateRange: z.object({
                from: z.coerce.date(),
                to: z.coerce.date()
            }).optional()
        }),

        handler: async ({ websiteId, dateRange }, ctx) => {
            const { env } = ctx.locals.runtime;
            const db = getDb(env);

            const overview = await dashboardService.getOverviewData({
                db,
                websiteId,
                dateRange
            });

            return overview;
        }
    })
};