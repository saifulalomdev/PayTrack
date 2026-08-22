// src/modules/fine/fine-repository.ts
import type { D1Instance } from "@/utils";
import { desc, eq, sum } from "drizzle-orm";
import type { InsertFine, NewFine, SelectFine } from "./fine-types";
import { fineTable } from "./fine-table";

export const fineRepository = {
  async create(db: D1Instance, data: NewFine): Promise<SelectFine> {
    const [newFine] = await db.insert(fineTable).values(data).returning();
    return newFine;
  },

  async update(db: D1Instance, id: string, data: Partial<InsertFine>): Promise<SelectFine> {
    const [updatedFine] = await db
      .update(fineTable)
      .set(data)
      .where(eq(fineTable.id, id))
      .returning();
    return updatedFine;
  },

  async delete(db: D1Instance, id: string): Promise<SelectFine> {
    const [deletedFine] = await db
      .delete(fineTable)
      .where(eq(fineTable.id, id))
      .returning();
    return deletedFine;
  },

  async findById(db: D1Instance, id: string): Promise<SelectFine | null> {
    const [row] = await db.select().from(fineTable).where(eq(fineTable.id, id)).execute();
    return row || null;
  },

  async findByProductId(db: D1Instance, productId: string): Promise<SelectFine[]> {
    const records = await db
      .select()
      .from(fineTable)
      .where(eq(fineTable.productId, productId))
      .orderBy(desc(fineTable.createdAt))
      .execute();
    return records || [];
  },

  async findAll(db: D1Instance): Promise<SelectFine[]> {
    const records = await db.select().from(fineTable).orderBy(desc(fineTable.createdAt)).execute();
    return records || [];
  },

  /**
   * Sum of all fine amounts for a product — feeds into
   * installmentService.getBalance so fines count as additional owed
   * amount, same role downPayment plays in reducing it.
   */
  async getTotalByProductId(db: D1Instance, productId: string): Promise<number> {
    const [row] = await db
      .select({ total: sum(fineTable.amount) })
      .from(fineTable)
      .where(eq(fineTable.productId, productId))
      .execute();

    return Number(row?.total ?? 0);
  },
};