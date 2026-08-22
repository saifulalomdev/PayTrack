// src/modules/dashboard/dashboard-actions.ts

import { defineAction } from "astro:actions";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { dashboardService } from "./dashboard-service";

/**
 * GET DASHBOARD METRICS — public action
 * Returns all three metrics: today collected, investment remaining, total customers
 */
export const getDashboardMetrics = defineAction({
  accept: "json",
  handler: async () => {
    const db = getDb(env);
    const metrics = await dashboardService.getDashboardMetrics(db);

    return {
      success: true,
      message: "Dashboard metrics loaded successfully.",
      data: metrics,
    };
  },
});

/**
 * GET TODAY COLLECTED — public action
 * Returns only today's collection amount
 */
export const getTodayCollected = defineAction({
  accept: "json",
  handler: async () => {
    const db = getDb(env);
    const amount = await dashboardService.getTodayCollected(db);

    return {
      success: true,
      message: "Today's collection loaded successfully.",
      data: amount,
    };
  },
});

/**
 * GET TOTAL INVESTMENT REMAINING — public action
 * Returns amount customers still owe
 */
export const getTotalInvestmentRemaining = defineAction({
  accept: "json",
  handler: async () => {
    const db = getDb(env);
    const amount = await dashboardService.getTotalInvestmentRemaining(db);

    return {
      success: true,
      message: "Total investment remaining loaded successfully.",
      data: amount,
    };
  },
});

/**
 * GET TOTAL CUSTOMERS — public action
 * Returns count of all customers
 */
export const getTotalCustomers = defineAction({
  accept: "json",
  handler: async () => {
    const db = getDb(env);
    const count = await dashboardService.getTotalCustomers(db);

    return {
      success: true,
      message: "Total customers loaded successfully.",
      data: count,
    };
  },
});