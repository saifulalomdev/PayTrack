// src/db/schema/site.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { generateUUID } from '@/lib/generate-uuid';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
import { event } from './event';

// ==========================================
// 1. DOMAIN CONFIGURATION (Single Source of Truth)
// ==========================================
export const SITE_RULES = {
  TITLE: {
    MIN: 2,
    MAX: 50,
  }
} as const;

// ==========================================
// 2. DATABASE TABLE DEFINITION
// ==========================================
export const site = sqliteTable("site", {
    id: text("id")
        .notNull()
        .primaryKey()
        .$defaultFn(generateUUID),
    title: text("title").notNull(),
    url: text("url").notNull(),
    isActive: integer("is_active", { mode: 'boolean' }).default(true),
});

export const siteRelations = relations(site, ({ many }) => ({
  events: many(event), // A site can have many events (One-to-Many)
}));

// ==========================================
// 3. ZOD FORM VALIDATION SCHEMAS
// ==========================================
export const createSiteSchema = createInsertSchema(site, {
    title: z.string()
        .min(SITE_RULES.TITLE.MIN, { 
            message: `Site title must be at least ${SITE_RULES.TITLE.MIN} characters long.` 
        })
        .max(SITE_RULES.TITLE.MAX, { 
            message: `Site title cannot exceed ${SITE_RULES.TITLE.MAX} characters.` 
        })
        .trim(),
    
    url: z.string()
        .min(1, { message: "Website URL is required." })
        .url({ message: "Please enter a valid website URL (e.g., https://example.com)." })
        .trim(),
        
    isActive: z.boolean().optional(),
}).omit({
    id: true,
});
export const updateSiteSchema = createSiteSchema.partial().extend({
    id: z.uuid()
})

export const selectSiteSchema = createSelectSchema(site);

// ==========================================
// 4. TYPESCRIPT TYPES
// ==========================================
export type Site = z.infer<typeof selectSiteSchema>;
export type NewSite = z.infer<typeof createSiteSchema>;