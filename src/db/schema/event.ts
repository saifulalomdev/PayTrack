import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { generateUUID } from '@/lib/generate-uuid';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { site } from './site';

// ==========================================
// 1. DOMAIN CONFIGURATION
// ==========================================
export const EVENT_RULES = {
  CURRENCY_LENGTH: 3,
} as const;

// ==========================================
// 2. DATABASE TABLE DEFINITION
// ==========================================
export const event = sqliteTable("event", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateUUID()),
  websiteId: text("website_id")
    .references(() => site.id, { onDelete: "cascade" })
    .notNull(),
  sessionId: text("session_id").notNull(),
  url: text("url").notNull(),
  pageTitle: text("page_title").notNull(),

  // Flattened Custom Event Handling
  eventType: text("event_type").notNull(),
  eventValue: real("event_value"),
  eventCurrency: text("event_currency"),

  // Screen and Context Indicators
  screenWidth: integer("screen_width"),
  screenHeight: integer("screen_height"),
  lang: text("lang"),
  referrer: text("referrer"),
  country: text("country"),

  // Structured URL Dynamic Parameters object mapping
  params: text("params", { mode: 'json' }).$type<Record<string, string>>(),

  // Handled reliably at storage instantiation row execution 
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
}, (table) => ({
  websiteTimeIdx: index("idx_events_website_time").on(table.websiteId, table.timestamp),
  sessionIdx: index("idx_events_session").on(table.sessionId),
}));

// ==========================================
// 3. ZOD INGESTION VALIDATION SCHEMAS
// ==========================================
// src/db/schema/event.ts

export const createEventSchema = createInsertSchema(event, {
  websiteId: z.string().uuid({ message: "Invalid tracking token identifier string." }),
  sessionId: z.string().min(1, { message: "Active tracking session token required." }),
  url: z.url(),
  pageTitle: z.string().trim(),
  eventType: z.string().min(1, { message: "Missing required analytics designation type." }),

  // Use .nullable() instead of .optional() to satisfy SQL requirements
  eventValue: z.number().nullable().default(null),
  eventCurrency: z.string().max(EVENT_RULES.CURRENCY_LENGTH).nullable().default(null),

  screenWidth: z.number().positive(),
  screenHeight: z.number().positive(),

  // Make these explicitly nullable string values
  lang: z.string().trim().nullable().default(null),
  referrer: z.string().trim().nullable().default(null),
  country: z.string().trim().nullable().default(null),

  // Tighten the Record type to match Drizzle's exact expectation
  params: z.record(z.string(), z.string()).nullable().default(null),
}).omit({
  id: true,
  timestamp: true,
});

export const selectEventSchema = createSelectSchema(event);

// ==========================================
// 4. TYPESCRIPT TYPES
// ==========================================
export type TrackFlowEvent = z.infer<typeof selectEventSchema>;
export type NewTrackFlowEvent = z.infer<typeof createEventSchema>;