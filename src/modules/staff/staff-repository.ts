// src/modules/staff/staff-repository.ts
import type { InsertStaff, SelectStaff, PublicStaff } from "./staff-types";
import type { D1Instance } from "@/utils";
import { staffTable } from "./staff-table";
import { desc, eq, count } from "drizzle-orm";

// Helper to exclude password hash from database return objects
function sanitizeStaff(staff: SelectStaff): PublicStaff {
  const { password, ...publicStaff } = staff;
  return publicStaff;
}

export const staffRepository = {
  async create(db: D1Instance, data: InsertStaff): Promise<PublicStaff> {
    const [newStaff] = await db.insert(staffTable).values(data).returning();
    return sanitizeStaff(newStaff);
  },

  async update(db: D1Instance, id: string, data: Partial<InsertStaff>): Promise<PublicStaff> {
    const [updatedStaff] = await db
      .update(staffTable)
      .set(data)
      .where(eq(staffTable.id, id))
      .returning();

    return sanitizeStaff(updatedStaff);
  },

  async deleteById(db: D1Instance, id: string): Promise<PublicStaff> {
    const [deletedStaff] = await db
      .delete(staffTable)
      .where(eq(staffTable.id, id))
      .returning();

    return sanitizeStaff(deletedStaff);
  },

  async findById(db: D1Instance, id: string): Promise<SelectStaff | null> {
    const [staff] = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.id, id))
      .execute();

    return staff || null;
  },

  async findByPhoneNumber(db: D1Instance, phoneNumber: string): Promise<SelectStaff | null> {
    const [staff] = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.phoneNumber, phoneNumber))
      .execute();

    return staff || null;
  },

  /**
   * FIND ALL: Retrieves all staff records without pagination (sanitized)
   */
  async findAll(db: D1Instance): Promise<PublicStaff[]> {
    const records = await db
      .select({
        id: staffTable.id,
        name: staffTable.name,
        phoneNumber: staffTable.phoneNumber,
        role: staffTable.role,
        tokenVersion: staffTable.tokenVersion,
        createdAt: staffTable.createdAt,
      })
      .from(staffTable)
      .orderBy(desc(staffTable.createdAt))
      .execute();

    return records || [];
  },

  /**
   * LIST: Paginated retrieval returning { items, totalCount }
   */
  async list(db: D1Instance, limit = 10, offset = 0): Promise<{ items: PublicStaff[]; totalCount: number }> {
    const items = await db
      .select({
        id: staffTable.id,
        name: staffTable.name,
        phoneNumber: staffTable.phoneNumber,
        role: staffTable.role,
        tokenVersion: staffTable.tokenVersion,
        createdAt: staffTable.createdAt,
      })
      .from(staffTable)
      .orderBy(desc(staffTable.createdAt))
      .limit(limit)
      .offset(offset)
      .execute();

    const [total] = await db.select({ value: count() }).from(staffTable).execute();

    return {
      items,
      totalCount: Number(total?.value ?? 0),
    };
  },
};