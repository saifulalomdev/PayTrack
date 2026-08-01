// src/modules/customer/customer.repository.ts
import { D1Instance } from "@/utils";
import { desc, eq, like, sql } from "drizzle-orm";
import { InsertCustomer, NewCustomer, SelectCustomer } from "./customer.types";
import { customerTable } from "./customer.table";

export const customerRepository = {
  /**
   * CREATE: Inserts a new customer
   */
   async create(db: D1Instance, data: NewCustomer): Promise<SelectCustomer> {
    const [newCustomer] = await db
      .insert(customerTable)
      .values(data)
      .returning();
 
    return newCustomer;
  },

  /**
   * UPDATE: Updates customer details by ID.
   * Admin-only — enforced in the action/service layer, not here.
   */
  async update(db: D1Instance, id: string, data: Partial<InsertCustomer>): Promise<SelectCustomer> {
    const [updatedCustomer] = await db
      .update(customerTable)
      .set(data)
      .where(eq(customerTable.id, id))
      .returning();

    return updatedCustomer;
  },

  /**
   * DELETE: Removes a customer.
   * Admin-only — enforced in the action/service layer, not here.
   */
  async delete(db: D1Instance, id: string): Promise<SelectCustomer> {
    const [deletedCustomer] = await db
      .delete(customerTable)
      .where(eq(customerTable.id, id))
      .returning();

    return deletedCustomer;
  },

  /**
   * FIND BY ID: Retrieves a single customer by ID
   */
  async findById(db: D1Instance, id: string): Promise<SelectCustomer | null> {
    const [customer] = await db
      .select()
      .from(customerTable)
      .where(eq(customerTable.id, id))
      .execute();

    return customer || null;
  },

  /**
   * FIND BY SERIAL NUMBER: Retrieves a customer by their unique serial number
   */
  async findBySerialNumber(db: D1Instance, serialNumber: string): Promise<SelectCustomer | null> {
    const [customer] = await db
      .select()
      .from(customerTable)
      .where(eq(customerTable.serialNumber, serialNumber))
      .execute();

    return customer || null;
  },

  /**
   * FIND ALL: Paginated, optionally filtered by a partial serial-number match.
   * `page` is 1-indexed. Returns both the page of rows and the total count
   * (matching the filter) so the caller can compute totalPages.
   */
  async findAll(
    db: D1Instance,
    options: { search?: string; page: number; pageSize: number }
  ): Promise<{ data: SelectCustomer[]; total: number }> {
    const { search, page, pageSize } = options;
    const offset = (page - 1) * pageSize;

    // Partial, case-sensitive-per-SQLite-default match on serial number only.
    const whereClause = search
      ? like(customerTable.serialNumber, `%${search}%`)
      : undefined;

    const [records, countResult] = await Promise.all([
      db
        .select()
        .from(customerTable)
        .where(whereClause)
        .orderBy(desc(customerTable.createdAt))
        .limit(pageSize)
        .offset(offset)
        .execute(),
      db
        .select({ count: sql<number>`count(*)` })
        .from(customerTable)
        .where(whereClause)
        .execute(),
    ]);

    return {
      data: records || [],
      total: Number(countResult[0]?.count ?? 0),
    };
  },
};