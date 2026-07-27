import { describe, it, expect } from "vitest";
import {
    formatPageTitle,
    formatPageUrl,
    formatViews,
    getCountryName,
    getPlatformName,
    getFaviconSource,
    calculateChange,
    formatTrendBuckets,
    type RawTrendBucket
} from "../dashboard.libs";

describe("Dashboard Utilities Unit Tests", () => {
    
    describe("formatPageTitle", () => {
        it("should return 'Untitled page' for missing, undefined, or empty values", () => {
            expect(formatPageTitle()).toBe("Untitled page");
            expect(formatPageTitle("   ")).toBe("Untitled page");
        });

        it("should return the original title if it is 30 characters or fewer", () => {
            const shortTitle = "TrackFlow Dashboard";
            expect(formatPageTitle(shortTitle)).toBe(shortTitle);
        });

        it("should truncate long titles above 30 characters and attach trailing ellipses", () => {
            const longTitle = "Welcome to the absolute best privacy first analytics platform online";
            expect(formatPageTitle(longTitle)).toBe("Welcome to the absolute best p...");
            expect(formatPageTitle(longTitle)).toHaveLength(33); // 30 chars + 3 dots
        });
    });

    describe("formatPageUrl", () => {
        it("should return a fallback string if the URL value is missing or whitespace", () => {
            expect(formatPageUrl()).toBe("No URL available");
            expect(formatPageUrl("  ")).toBe("No URL available");
        });

        it("should strip protocols (http, https) and www subdomains cleanly", () => {
            expect(formatPageUrl("https://www.saifulalom.com/blog")).toBe("saifulalom.com/blog");
            expect(formatPageUrl("http://saifulalom.com")).toBe("saifulalom.com");
        });

        it("should remove trailing slashes from the end of matching URLs", () => {
            expect(formatPageUrl("saifulalom.com/projects/")).toBe("saifulalom.com/projects");
        });
    });

    describe("formatViews", () => {
        it("should return '0' for NaN contexts or negative metric numbers", () => {
            expect(formatViews("invalid-number")).toBe("0");
            expect(formatViews(-42)).toBe("0");
        });

        it("should format string numbers or valid numbers into localized comma notation strings", () => {
            expect(formatViews(1250)).toBe("1,250");
            expect(formatViews("1000000")).toBe("1,000,000");
        });
    });

    describe("getCountryName", () => {
        it("should convert standard two-letter ISO codes into English country nodes", () => {
            expect(getCountryName("BD")).toBe("Bangladesh");
            expect(getCountryName("US")).toBe("United States");
        });

        it("should return the fallback code if the input string is invalid or causes an internal throw", () => {
            expect(getCountryName("XX")).toBe("XX");
        });
    });

    describe("getPlatformName", () => {
        it("should default to 'Direct' for empty parameters, Direct, or structured fallback labels", () => {
            expect(getPlatformName("")).toBe("Direct");
            expect(getPlatformName("Direct / None")).toBe("Direct");
        });

        it("should parse standard referrers, stripping down subdomains and tracking TLD extensions", () => {
            expect(getPlatformName("https://l.facebook.com/some-path")).toBe("Facebook");
            expect(getPlatformName("https://google.com")).toBe("Google");
        });

        it("should output the source fallback if the referrer cannot pass valid URL verification parameters", () => {
            expect(getPlatformName("raw-text-referrer")).toBe("raw-text-referrer");
        });
    });

    describe("getFaviconSource", () => {
        it("should return a Lucide Globe icon representation if no sourceName is provided", () => {
            expect(getFaviconSource("")).toEqual({ type: "icon", value: "Globe" });
        });

        it("should match direct source entries with their corresponding Lucide indicator", () => {
            expect(getFaviconSource("direct")).toEqual({ type: "icon", value: "ArrowUpRight" });
        });

        it("should build valid Google Favicon provider pipelines utilizing mapped static structures", () => {
            expect(getFaviconSource("google")).toEqual({
                type: "url",
                value: "https://www.google.com/s2/favicons?domain=google.com&sz=32"
            });
        });

        it("should append a default .com wrapper to unmapped custom system targets", () => {
            expect(getFaviconSource("github")).toEqual({
                type: "url",
                value: "https://www.google.com/s2/favicons?domain=github.com&sz=32"
            });
        });
    });

    describe("calculateChange", () => {
        it("should return 0% or +100% surge metrics safely when previous data bounds evaluate to 0", () => {
            expect(calculateChange(0, 0)).toBe("0%");
            expect(calculateChange(150, 0)).toBe("+100%");
        });

        it("should evaluate positive and negative variance, processing integers with mathematically exact rounding styles", () => {
            expect(calculateChange(150, 100)).toBe("+50%");
            expect(calculateChange(33, 100)).toBe("-67%");
            expect(calculateChange(100, 100)).toBe("+0%");
        });
    });

    describe("formatTrendBuckets", () => {
        const sampleBuckets: RawTrendBucket[] = [
            { bucket_index: 0, bucket_start_time: "2026-06-01 14:00:00", current_views: 25 }
        ];

        it("should quickly forward empty arrays if the trend data array sequence is blank", () => {
            expect(formatTrendBuckets([], 5)).toEqual([]);
        });

        it("should render localized hourly timestamps (HH:mm) for single-day analytical scopes", () => {
            const results = formatTrendBuckets(sampleBuckets, 1);
            expect(results[0]).toEqual({ date: "14:00", traffic: 25 });
        });

        it("should render short day structures alongside hourly anchors (EEE HH'h') for week-long analytics grids", () => {
            // June 1, 2026 is a Monday
            const results = formatTrendBuckets(sampleBuckets, 5);
            expect(results[0]).toEqual({ date: "Mon 14h", traffic: 25 });
        });

        it("should display standard calendar date layouts (dd MMM) for large analysis durations", () => {
            const results = formatTrendBuckets(sampleBuckets, 30);
            expect(results[0]).toEqual({ date: "01 Jun", traffic: 25 });
        });
    });
});