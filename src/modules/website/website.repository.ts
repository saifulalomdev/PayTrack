// src/db/services/site.ts
import { and, desc, eq, sql } from "drizzle-orm";
import { site } from "@/db/schema";
import type { NewSite, Site } from "@/db/schema"; // Importing single source of truth inferred types
import type { D1Instance } from "@/lib/get-db";

export const siteRepository = {
  /**
   * CREATE: Inserts a new site using the inferred type directly
   */
  async create(db: D1Instance, data: NewSite): Promise<Site> {
    const [newSite] = await db
      .insert(site)
      .values(data)
      .returning();

    return newSite;
  },

  /**
   * UPDATE: Updates site settings using single source of truth schemas
   */
  async update(db: D1Instance, id: string, data: Partial<NewSite>): Promise<Site> {
    const [updatedSite] = await db
      .update(site)
      .set(data)
      .where(eq(site.id, id))
      .returning();

    return updatedSite;
  },

  /**
   * DELETE: Removes a site profile from the system securely
   */
  async delete(db: D1Instance, id: string): Promise<Site> {
    const [deletedSite] = await db
      .delete(site)
      .where(eq(site.id, id))
      .returning();

    return deletedSite;
  },

  /**
   * FIND ACTIVE: Retrieves a site profile only if it is currently active
   */
  async findActive(db: D1Instance, id: string): Promise<Site | null> {
    const [activeSite] = await db
      .select()
      .from(site)
      .where(
        and(
          eq(site.id, id),
          eq(site.isActive, true)
        )
      )
      .execute();

    return activeSite || null;
  },

  /**
   * FIND ALL: Retrieves all site profiles registered in the system
   */
  async findAll(db: D1Instance): Promise<Site[]> {
    const records = await db
      .select()
      .from(site)
      .orderBy(desc(sql`rowid`))
      .execute();

    return records || [];
  },
  /**
 * FIND LATEST: Retrieves the single most recently updated or created site profile
 */
  async findLatest(db: D1Instance): Promise<Site | null> {
    const records = await db
      .select()
      .from(site)
      .orderBy(desc(sql`rowid`))
      .limit(1)
      .execute();

    return records[0] || null;
  }
};