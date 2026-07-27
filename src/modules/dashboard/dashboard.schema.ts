import { z } from "zod";

export const getAnalyticsSchema = z.object({
  websiteId: z.string().optional(),
  dateRange: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }).optional(),
});

export type GetAnalyticsInput = z.infer<typeof getAnalyticsSchema>;

// Contract layout returned to your frontend application components
export interface AnalyticsSummaryPayload {
  websiteId: string | null;
  dateRange: {
    from: string;
    to: string;
  };
  metrics: {
    totalVisits: number;
    uniqueVisitors: number;
  };
  countries: Array<{
    name: string | null;
    count: number;
  }>;
}