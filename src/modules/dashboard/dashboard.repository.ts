// src/modules/dashboard/dashboard.repository.ts
import type { D1Instance } from "@/lib";
import { sql } from "drizzle-orm";
import { event } from "@/db/schema";

export interface RepositoryQueryParams {
    activeSiteId: string;
    currentFromStr: string;
    currentToStr: string;
    prevFromStr: string;
    prevToStr: string;
}

export const dashboardRepository = {
    getStats: (db: D1Instance, { activeSiteId, currentFromStr, currentToStr, prevFromStr }: RepositoryQueryParams) => {
        return db.run(sql`
            WITH session_metrics AS (
                SELECT 
                    session_id,
                    CASE WHEN timestamp >= ${currentFromStr} AND timestamp <= ${currentToStr} THEN 1 ELSE 0 END as is_current,
                    count(id) as hits_count,
                    (strftime('%s', max(timestamp)) - strftime('%s', min(timestamp))) as duration_seconds,
                    sum(case when event_type = 'conversion' then 1 else 0 end) as conversion_count
                FROM ${event}
                WHERE website_id = ${activeSiteId} AND timestamp >= ${prevFromStr} AND timestamp <= ${currentToStr}
                GROUP BY session_id
            )
            SELECT
                count(case when is_current = 1 then session_id end) as total_traffic,
                coalesce(round((count(case when is_current = 1 and hits_count = 1 then 1 end) * 100.0) / nullif(count(case when is_current = 1 then session_id end), 0), 0), 0) as bounce_rate,
                coalesce(round(avg(case when is_current = 1 then duration_seconds end), 0), 0) as avg_duration,
                coalesce(round((count(case when is_current = 1 and conversion_count > 0 then 1 end) * 100.0) / nullif(count(case when is_current = 1 then session_id end), 0), 0), 0) as conversion_rate,
                count(case when is_current = 0 then session_id end) as prev_total_traffic,
                coalesce(round((count(case when is_current = 0 and hits_count = 1 then 1 end) * 100.0) / nullif(count(case when is_current = 0 then session_id end), 0), 0), 0) as prev_bounce_rate,
                coalesce(round(avg(case when is_current = 0 then duration_seconds end), 0), 0) as prev_avg_duration,
                coalesce(round((count(case when is_current = 0 and conversion_count > 0 then 1 end) * 100.0) / nullif(count(case when is_current = 0 then session_id end), 0), 0), 0) as prev_conversion_rate
            FROM session_metrics
        `);
    },

    getPageviews: (db: D1Instance, { activeSiteId, currentFromStr, currentToStr }: RepositoryQueryParams) => {
        return db.run(sql`
            SELECT page_title as title, url, count(id) as views
            FROM ${event}
            WHERE website_id = ${activeSiteId} AND timestamp >= ${currentFromStr} AND timestamp <= ${currentToStr}
            GROUP BY url, page_title 
            ORDER BY views DESC 
            LIMIT 10
        `);
    },

    getDevices: async (
        db: D1Instance,
        { activeSiteId, currentFromStr, currentToStr }: RepositoryQueryParams
    ) => {
        return db.run(sql`
        SELECT 
            CASE 
                WHEN screen_width >= 1024 THEN 'Desktop'
                WHEN screen_width >= 768 THEN 'Tablet'
                ELSE 'Mobile'
            END as name,
            count(DISTINCT session_id) as visitors
        FROM ${event}
        WHERE website_id = ${activeSiteId} 
          AND timestamp >= ${currentFromStr} 
          AND timestamp <= ${currentToStr}
        GROUP BY name
        ORDER BY visitors DESC
    `);
    },

    getCountries: (db: D1Instance, { activeSiteId, currentFromStr, currentToStr }: RepositoryQueryParams) => {
        return db.run(sql`
        SELECT 
            country as name, 
            count(DISTINCT session_id) as visitors
        FROM ${event}
        WHERE website_id = ${activeSiteId} 
          AND timestamp >= ${currentFromStr} 
          AND timestamp <= ${currentToStr}
        GROUP BY country 
        ORDER BY visitors DESC
        LIMIT 5
    `);
    },

    getTrends: (db: D1Instance, { currentFromStr, currentToStr, activeSiteId }: RepositoryQueryParams) => {
        // 1. Pre-calculate boundaries in JS/TS to offload D1 computation
        const startTs = Math.floor(new Date(currentFromStr).getTime() / 1000);
        const endTs = Math.floor(new Date(currentToStr).getTime() / 1000);
        const bucketWidth = (endTs - startTs) / 12.0;

        return db.run(sql`
        WITH RECURSIVE buckets(n) AS (
            SELECT 0 
            UNION ALL 
            SELECT n + 1 FROM buckets WHERE n < 11
        )
        SELECT 
            b.n as bucket_index,
            datetime(${startTs} + (b.n * ${bucketWidth}), 'unixepoch') as bucket_start_time,
            count(e.id) as current_views
        FROM buckets b
        LEFT JOIN ${event} e ON e.website_id = ${activeSiteId} 
            -- Compare native text timestamps directly to allow index usage
            AND e.timestamp >= datetime(${startTs} + (b.n * ${bucketWidth}), 'unixepoch')
            AND (
                (b.n < 11 AND e.timestamp < datetime(${startTs} + ((b.n + 1) * ${bucketWidth}), 'unixepoch'))
                OR 
                (b.n = 11 AND e.timestamp <= datetime(${endTs}, 'unixepoch'))
            )
        GROUP BY b.n
        ORDER BY b.n ASC
    `);
    },

    getReferrers: (db: D1Instance, { activeSiteId, currentFromStr, currentToStr }: RepositoryQueryParams) => {
        return db.run(sql`
        SELECT 
            coalesce(nullif(referrer, ''), 'Direct / None') as name, 
            count(DISTINCT session_id) as visitors
        FROM ${event}
        WHERE website_id = ${activeSiteId} 
          AND timestamp >= ${currentFromStr} 
          AND timestamp <= ${currentToStr}
        GROUP BY name
        ORDER BY visitors DESC 
        LIMIT 10
    `);
    },
};