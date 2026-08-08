// src/modules/staff/staff.repository.ts
import type { InsertStaff, SelectStaff } from "./staff-types";
import type { D1Instance } from "@/utils";
import { staffTable } from "./staff-table";
import { desc, eq } from "drizzle-orm";

export const staffRepository = {
  /**
   * CREATE: Inserts a new staff member
   */
  async create(db: D1Instance, data: InsertStaff): Promise<SelectStaff> {
    const [newStaff] = await db
      .insert(staffTable)
      .values(data)
      .returning();

    return newStaff;
  },

  /**
   * UPDATE: Updates staff details by ID
   */
  async update(db: D1Instance, id: string, data: Partial<InsertStaff>): Promise<SelectStaff> {
    const [updatedStaff] = await db
      .update(staffTable)
      .set(data)
      .where(eq(staffTable.id, id))
      .returning();

    return updatedStaff;
  },

  /**
   * DELETE: Removes a staff member securely
   */
  async delete(db: D1Instance, id: string): Promise<SelectStaff> {
    const [deletedStaff] = await db
      .delete(staffTable)
      .where(eq(staffTable.id, id))
      .returning();

    return deletedStaff;
  },

  /**
   * FIND BY ID: Retrieves a single staff member by ID
   */
  async findById(db: D1Instance, id: string): Promise<SelectStaff | null> {
    const [staff] = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.id, id))
      .execute();

    return staff || null;
  },

  /**
   * FIND BY PHONE NUMBER: Retrieves a staff member by phone number
   */
  async findByPhoneNumber(db: D1Instance, phoneNumber: string): Promise<SelectStaff | null> {
    const [staff] = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.phoneNumber, phoneNumber))
      .execute();

    return staff || null;
  },

  /**
   * FIND ALL: Retrieves all staff members, ordered by creation date
   */
  async findAll(db: D1Instance): Promise<SelectStaff[]> {
    const records = await db
      .select()
      .from(staffTable)
      .orderBy(desc(staffTable.createdAt))
      .execute();

    return records || [];
  },

  async findByRole(
    db: D1Instance,
    role: typeof staffTable.$inferSelect.role
  ): Promise<SelectStaff | null> {
    const result = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.role, role))
      .get();

    return result ?? null;
  },
};