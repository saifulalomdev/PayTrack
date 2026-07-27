// src/modules/dashboard/dashboard.service.ts
import { getDefaultTimeRange } from "@/lib";
import { siteRepository } from "@/db";
import { format, subDays, differenceInCalendarDays } from "date-fns";
import { dashboardRepository } from "./dashboard.repository";
import type { DashboardPageProps, DashboardStatItem, GetOverviewParams, DeviceItem } from "./dashboard.types";
import { calculateChange, formatTrendBuckets, getPlatformName } from "./dashboard.libs";
import { formatSeconds } from "@/lib/format-seconds";

export const dashboardService = {
    async getOverviewData({ db, websiteId, dateRange }: GetOverviewParams): Promise<DashboardPageProps | null> {
        const defaultRange = getDefaultTimeRange();
        const dateFrom = dateRange?.from || defaultRange.from || new Date();
        const dateTo = dateRange?.to || defaultRange.to || new Date();

        const daysDifference = differenceInCalendarDays(dateTo, dateFrom) + 1;
        const prevDateFrom = subDays(dateFrom, daysDifference);
        const prevDateTo = subDays(dateTo, daysDifference);

        // 1. Resolve site information instantly to prevent client-side UI flickering
        const latestSite = await siteRepository.findLatest(db);
        const siteList = await siteRepository.findAll(db);
        const activeSiteId = websiteId || latestSite?.id || "";

        const queryCtx = {
            activeSiteId,
            currentFromStr: format(dateFrom, "yyyy-MM-dd HH:mm:ss"),
            currentToStr: format(dateTo, "yyyy-MM-dd HH:mm:ss"),
            prevFromStr: format(prevDateFrom, "yyyy-MM-dd HH:mm:ss"),
            prevToStr: format(prevDateTo, "yyyy-MM-dd HH:mm:ss")
        };

        if (!queryCtx.activeSiteId) return null;

        // 2. Parallelize standalone query functions via Promise.all
        const [
            statsQuery,
            pageviewsQuery,
            devicesQuery,
            countriesQuery,
            trendsQuery,
            referrersQuery
        ] = await Promise.all([
            dashboardRepository.getStats(db, queryCtx),
            dashboardRepository.getPageviews(db, queryCtx),
            dashboardRepository.getDevices(db, queryCtx),
            dashboardRepository.getCountries(db, queryCtx),
            dashboardRepository.getTrends(db, queryCtx),
            dashboardRepository.getReferrers(db, queryCtx)
        ]);

        const rawStats = (statsQuery.results?.[0] as Record<string, unknown>) || {};
        const rawPageviews = (pageviewsQuery.results || []) as Record<string, unknown>[];
        const rawDevices = (devicesQuery.results || []) as DeviceItem[];
        const rawCountries = (countriesQuery.results || []) as Record<string, unknown>[];
        const rawTrends = (trendsQuery.results || []) as Record<string, unknown>[];
        const rawReferrers = (referrersQuery.results || []) as Record<string, unknown>[];

        // 3. Transform database stats into explicitly typed items
        const stats: DashboardStatItem[] = [
            {
                name: "totalTraffic",
                value: Number(rawStats.total_traffic || 0) >= 1000
                    ? `${(Number(rawStats.total_traffic || 0) / 1000).toFixed(1).replace('.0', '')}k`
                    : String(rawStats.total_traffic || 0),
                changes: calculateChange(Number(rawStats.total_traffic || 0), Number(rawStats.prev_total_traffic || 0))
            },
            {
                name: "bounceRate",
                value: `${rawStats.bounce_rate || 0}%`,
                changes: calculateChange(Number(rawStats.bounce_rate || 0), Number(rawStats.prev_bounce_rate || 0))
            },
            {
                name: "avgSessionDuration",
                value: formatSeconds(rawStats.avg_duration as number),
                changes: calculateChange(Number(rawStats.avg_duration || 0), Number(rawStats.prev_avg_duration || 0))
            },
            {
                name: "conversionRate",
                value: `${rawStats.conversion_rate || 0}%`,
                changes: calculateChange(Number(rawStats.conversion_rate || 0), Number(rawStats.prev_conversion_rate || 0))
            }
        ];

        return {
            dateRange: {
                from: dateFrom,
                to: dateTo
            },
            stats,
            pageviews: rawPageviews.map(p => ({
                title: String(p.title || ""),
                url: String(p.url || ""),
                views: Number(p.views || 0)
            })),
            devices: rawDevices,
            trafficTrends: formatTrendBuckets(rawTrends as any, daysDifference),
            countries: rawCountries.map(({ name, visitors }: any) => ({
                name: String(name || "").toUpperCase(), // Sends clean 'BD', 'US', 'SG' strings
                visitors: Number(visitors || 0)
            })),
            sites: siteList,
            activeSiteId,
            referrers: rawReferrers.map(({ name, visitors }: any) => ({ name: getPlatformName(name), visitors }))
        };
    }
};