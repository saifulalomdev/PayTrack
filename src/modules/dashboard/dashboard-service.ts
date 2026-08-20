// src/modules/dashboard/dashboard-service.ts
import { dashboardRepository } from "./dashboard-repository";
import type { SelectDashboard, PublicDashboard } from "./dashboard-types";
import type { D1Instance } from "@/utils";

/**
 * Transforms raw SelectDashboard to PublicDashboard.
 * Currently they're identical, but kept separate for consistency with project pattern.
 * If sensitive data is added in the future, this is where it gets stripped.
 */
function toPublicDashboard(dashboard: SelectDashboard): PublicDashboard {
    return dashboard;
}

/**
 * Service layer: Business logic, aggregations, and data transformations.
 * All methods return PublicDashboard (never raw SelectDashboard to actions).
 */
export const dashboardService = {
    /**
     * Get all dashboard metrics efficiently in one call.
     * Returns: PublicDashboard with all three metrics.
     */
    async getDashboardMetrics(db: D1Instance): Promise<PublicDashboard> {
        const [todayCollected, totalInvestmentRemaining, totalCustomers] =
            await Promise.all([
                dashboardRepository.getTodayCollectedRaw(db),
                dashboardRepository.getTotalInvestmentRemainingRaw(db),
                dashboardRepository.getTotalCustomersRaw(db),
            ]);

        const dashboard: SelectDashboard = {
            todayCollected,
            totalInvestmentRemaining,
            totalCustomers,
        };

        return toPublicDashboard(dashboard);
    },

    /**
     * Get today's collected amount only.
     */
    async getTodayCollected(db: D1Instance): Promise<number> {
        return dashboardRepository.getTodayCollectedRaw(db);
    },

    /**
     * Get total investment remaining only.
     */
    async getTotalInvestmentRemaining(db: D1Instance): Promise<number> {
        return dashboardRepository.getTotalInvestmentRemainingRaw(db);
    },

    /**
     * Get total customers only.
     */
    async getTotalCustomers(db: D1Instance): Promise<number> {
        return dashboardRepository.getTotalCustomersRaw(db);
    },

    async getDailyCollections(db: D1Instance, limit: number, offset: number) {
        const [items, totalCount] = await Promise.all([
            dashboardRepository.getDailyCollectionsRaw(db, limit, offset),
            dashboardRepository.getDailyCollectionsCountRaw(db),
        ]);

        return {
            items,
            totalCount,
        };
    },
    async getDailyCollectionDetails(db: D1Instance, dateStr: string) {
        if (!dateStr) return [];
        return await dashboardRepository.getDailyCollectionDetailsRaw(db, dateStr);
    },
};