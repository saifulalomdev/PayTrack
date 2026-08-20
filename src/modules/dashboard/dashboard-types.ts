// src/modules/dashboard/dashboard-types.ts
import { z } from "zod";

/**
 * Raw dashboard metrics from the repository.
 * This is what comes directly from database operations.
 */
export const selectDashboardSchema = z.object({
  todayCollected: z.number().int().nonnegative(),
  totalInvestmentRemaining: z.number().int().nonnegative(),
  totalCustomers: z.number().int().nonnegative(),
});

export type SelectDashboard = z.infer<typeof selectDashboardSchema>;

/**
 * Public dashboard metrics safe to send to the client.
 * Same as SelectDashboard (no sensitive data to strip).
 * Kept separate for consistency with project pattern.
 */
export type PublicDashboard = SelectDashboard;