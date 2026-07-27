import { eq, and, gte, lte, desc } from "drizzle-orm";
import type { D1Instance } from "@/lib/get-db";
import { event, type NewTrackFlowEvent, type TrackFlowEvent } from "@/db";

export const eventRepository = {
  /**
   * INGESTION: Appends tracked device data rows directly onto Cloudflare D1
   */
  async ingest(db: D1Instance, data: NewTrackFlowEvent): Promise<TrackFlowEvent> {
    const [newEvent] = await db
      .insert(event)
      .values(data)
      .returning();
      
    return newEvent;
  },

  /**
   * SCAN: Retrieves chronologically indexed historical log streams mapping to individual properties
   */
  async getByWebsiteId(
    db: D1Instance, 
    websiteId: string, 
    limitNum = 100
  ): Promise<TrackFlowEvent[]> {
    return await db
      .select()
      .from(event)
      .where(eq(event.websiteId, websiteId))
      .orderBy(desc(event.timestamp))
      .limit(limitNum);
  },

  /**
   * RANGE REPORTING: Queries scoped windows matching dynamic timestamp filtering boundaries
   */
  async getWebsiteEventsInWindow(
    db: D1Instance,
    websiteId: string,
    startDateISO: string,
    endDateISO: string
  ): Promise<TrackFlowEvent[]> {
    return await db
      .select()
      .from(event)
      .where(
        and(
          eq(event.websiteId, websiteId),
          gte(event.timestamp, startDateISO),
          lte(event.timestamp, endDateISO)
        )
      )
      .orderBy(desc(event.timestamp));
  }
};