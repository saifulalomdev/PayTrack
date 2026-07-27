// src/modules/dashboard/dashboard.repository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { getDb } from '@/lib';
import { env } from 'cloudflare:workers';
import { site, event } from '@/db/schema';
import { dashboardRepository, type RepositoryQueryParams } from '../dashboard.repository';

describe("Dashboard Repository Integration Tests", () => {
    const db = getDb(env);
    const activeSiteId = "test-site-uuid-123";

    const queryParams: RepositoryQueryParams = {
        activeSiteId,
        prevFromStr: "2026-06-20T00:00:00Z",
        prevToStr: "2026-06-20T23:59:59Z",
        currentFromStr: "2026-06-21T00:00:00Z",
        currentToStr: "2026-06-21T23:59:59Z",
    };

    beforeEach(async () => {
        // Due to the Cascade delete reference, clearing site cleans up events cascade-style safely
        await db.delete(event);
        await db.delete(site);

        // Insert mock site to fulfill foreign key constraints
        await db.insert(site).values({
            id: activeSiteId,
            title: "Test Analytics Site",
            url: "https://trackflow.dev",
            isActive: true,
        });
    });

    it("should calculate correct analytics stats for current vs previous periods", async () => {
        await db.insert(event).values([
            // Current Period - Multi-hit Session (Duration & Conversion)
            { 
                id: "e1", 
                websiteId: activeSiteId, 
                sessionId: "sess-curr-1", 
                url: "/", 
                pageTitle: "Home", 
                eventType: "pageview", 
                timestamp: "2026-06-21T10:00:00Z" 
            },
            { 
                id: "e2", 
                websiteId: activeSiteId, 
                sessionId: "sess-curr-1", 
                url: "/checkout", 
                pageTitle: "Checkout", 
                eventType: "conversion", 
                timestamp: "2026-06-21T10:05:00Z" 
            },
            
            // Current Period - Bounced Session (Single hit)
            { 
                id: "e3", 
                websiteId: activeSiteId, 
                sessionId: "sess-curr-2", 
                url: "/", 
                pageTitle: "Home", 
                eventType: "pageview", 
                timestamp: "2026-06-21T11:00:00Z" 
            },

            // Previous Period Session
            { 
                id: "e4", 
                websiteId: activeSiteId, 
                sessionId: "sess-prev-1", 
                url: "/", 
                pageTitle: "Home", 
                eventType: "pageview", 
                timestamp: "2026-06-20T15:00:00Z" 
            }
        ]);

        const result = await dashboardRepository.getStats(db, queryParams);
        const stats = result.results[0] as any;

        expect(stats).toBeDefined();
        expect(Number(stats.total_traffic)).toBe(2); 
        expect(Number(stats.bounce_rate)).toBe(50);
        expect(Number(stats.avg_duration)).toBe(150); // 300s from sess-curr-1 + 0s from sess-curr-2 / 2
        expect(Number(stats.conversion_rate)).toBe(50);

        expect(Number(stats.prev_total_traffic)).toBe(1);
        expect(Number(stats.prev_bounce_rate)).toBe(100);
    });

    it("should fetch top pageviews sorted by views descending up to limit of 10", async () => {
        await db.insert(event).values([
            { id: "p1", websiteId: activeSiteId, sessionId: "s1", url: "/docs", pageTitle: "Documentation", eventType: "pageview", timestamp: "2026-06-21T12:00:00Z" },
            { id: "p2", websiteId: activeSiteId, sessionId: "s2", url: "/docs", pageTitle: "Documentation", eventType: "pageview", timestamp: "2026-06-21T12:01:00Z" },
            { id: "p3", websiteId: activeSiteId, sessionId: "s3", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T12:02:00Z" }
        ]);

        const result = await dashboardRepository.getPageviews(db, queryParams);
        const pageviews = result.results as any[];

        expect(pageviews.length).toBe(2);
        expect(pageviews[0].url).toBe("/docs");
        expect(pageviews[0].title).toBe("Documentation");
        expect(Number(pageviews[0].views)).toBe(2);
        expect(pageviews[1].url).toBe("/");
        expect(Number(pageviews[1].views)).toBe(1);
    });

    it("should aggregate device types checking screenWidth breakpoints", async () => {
        await db.insert(event).values([
            { id: "d1", websiteId: activeSiteId, sessionId: "s-desktop", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T08:00:00Z", screenWidth: 1200 },
            { id: "d2", websiteId: activeSiteId, sessionId: "s-tablet", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T09:00:00Z", screenWidth: 800 },
            { id: "d3", websiteId: activeSiteId, sessionId: "s-mobile", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T10:00:00Z", screenWidth: 360 }
        ]);

        const result = await dashboardRepository.getDevices(db, queryParams);
        const devices = result.results as any[];

        const desktop = devices.find(d => d.name === "Desktop");
        const tablet = devices.find(d => d.name === "Tablet");
        const mobile = devices.find(d => d.name === "Mobile");

        expect(Number(desktop?.visitors)).toBe(1);
        expect(Number(tablet?.visitors)).toBe(1);
        expect(Number(mobile?.visitors)).toBe(1);
    });

    it("should return top unique visitors grouping by country with a maximum limit of 5", async () => {
        await db.insert(event).values([
            { id: "c1", websiteId: activeSiteId, sessionId: "sess-1", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T05:00:00Z", country: "BD" },
            { id: "c2", websiteId: activeSiteId, sessionId: "sess-2", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T06:00:00Z", country: "BD" }, 
            { id: "c3", websiteId: activeSiteId, sessionId: "sess-3", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T07:00:00Z", country: "US" }
        ]);

        const result = await dashboardRepository.getCountries(db, queryParams);
        const countries = result.results as any[];

        expect(countries[0].name).toBe("BD");
        expect(Number(countries[0].visitors)).toBe(2);
        expect(countries[1].name).toBe("US");
        expect(Number(countries[1].visitors)).toBe(1);
    });

    it("should calculate mathematical trend buckets successfully without crashing", async () => {
        await db.insert(event).values([
            { id: "t1", websiteId: activeSiteId, sessionId: "s1", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T02:00:00Z" }
        ]);

        const result = await dashboardRepository.getTrends(db, queryParams);
        const trendBuckets = result.results as any[];

        // Assures RECURSIVE buckets generate all 12 timeline slots correctly
        expect(trendBuckets.length).toBe(12);
        expect(trendBuckets[0].bucket_index).toBe(0);
        expect(trendBuckets[11].bucket_index).toBe(11);
    });

    it("should process referrers and correctly group empty strings or null into 'Direct / None'", async () => {
        await db.insert(event).values([
            { id: "r1", websiteId: activeSiteId, sessionId: "s1", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T04:00:00Z", referrer: "https://github.com" },
            { id: "r2", websiteId: activeSiteId, sessionId: "s2", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T05:00:00Z", referrer: "" },
            { id: "r3", websiteId: activeSiteId, sessionId: "s3", url: "/", pageTitle: "Home", eventType: "pageview", timestamp: "2026-06-21T06:00:00Z", referrer: null }
        ]);

        const result = await dashboardRepository.getReferrers(db, queryParams);
        const referrers = result.results as any[];

        const directRow = referrers.find(r => r.name === "Direct / None");
        const githubRow = referrers.find(r => r.name === "https://github.com");

        expect(Number(directRow?.visitors)).toBe(2);
        expect(Number(githubRow?.visitors)).toBe(1);
    });
});