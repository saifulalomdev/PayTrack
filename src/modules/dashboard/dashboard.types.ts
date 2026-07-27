import type { Site } from "@/db";
import type { D1Instance } from "@/lib";
import type { DateRange } from "react-day-picker";

export interface DashboardStatItem {
    name: "totalTraffic" | "bounceRate" | "avgSessionDuration" | "conversionRate";
    value: string;
    changes: string;
}

export interface PageviewItem {
    title: string;
    url: string;
    views: number;
}

export interface DeviceItem {
    name: "Desktop" | "Tablet" | "Mobile";
    visitors: number;
}

export interface CountryItem {
    name: string;
    visitors: number;
}
export interface TrafficTrendDataPoint {
  /** Formatted axis label string (e.g., "07:26", "Tue 14h", "02 Jun") */
  date: string;
  /** Normalized pageview/hit integer ready for visualization engines */
  traffic: number;
}

export interface RawTrafficTrendBucket {
  /** The chronological sequential index of the time bucket */
  bucket_index: number;
  /** Raw SQL timestamp string format: "YYYY-MM-DD HH:MM:SS" */
  bucket_start_time: string;
  /** Cumulative pageview/event hits parsed in this time window */
  current_views: number;
}

export interface DashboardPageProps {
    stats: DashboardStatItem[] | undefined;
    pageviews: PageviewItem[];
    devices: DeviceItem[];
    trafficTrends: TrafficTrendDataPoint[];
    countries: CountryItem[];
    referrers: CountryItem[];
    sites: Site[];
    activeSiteId: string | undefined;
    dateRange: DateRange;
    errorMsg?: string
}

export interface GetOverviewParams {
    db: D1Instance,
    dateRange?: DateRange,
    websiteId?: string,
}