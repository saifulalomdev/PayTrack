// src/modules/installment/installment-repository.ts
import { eq, sum, ne, and } from "drizzle-orm";
import { installmentTable } from "./installment-table";
import type { D1Instance } from "@/utils";
import type { InsertInstallment, UpdateInstallment } from "./installment-types";

export const installmentRepository = {
  createInstallment: async (db: D1Instance, data: InsertInstallment) => {
    const [result] = await db
      .insert(installmentTable)
      .values(data as any)
      .returning();
    return result;
  },

  findInstallmentsByProductId: async (db: D1Instance, productId: string) => {
    return await db
      .select()
      .from(installmentTable)
      .where(eq(installmentTable.productId, productId))
      .orderBy(installmentTable.paidAt);
  },

  findInstallmentById: async (db: D1Instance, id: string) => {
    const results = await db
      .select()
      .from(installmentTable)
      .where(eq(installmentTable.id, id));

    return results[0] || null;
  },

  updateInstallmentById: async (db: D1Instance, id: string, data: UpdateInstallment) => {
    const [result] = await db
      .update(installmentTable)
      .set(data as any)
      .where(eq(installmentTable.id, id))
      .returning();

    return result;
  },

  getTotalPaidByProductId: async (db: D1Instance, productId: string) => {
    const [result] = await db
      .select({ total: sum(installmentTable.amountPaid) })
      .from(installmentTable)
      .where(eq(installmentTable.productId, productId));

    return Number(result?.total ?? 0);
  },

  // Same as above, but excludes one installment — used when validating an
  // update, so the installment being edited doesn't count against its own
  // remaining-balance check.
  getTotalPaidByProductIdExcluding: async (
    db: D1Instance,
    productId: string,
    excludeId: string
  ) => {
    const [result] = await db
      .select({ total: sum(installmentTable.amountPaid) })
      .from(installmentTable)
      .where(
        and(
          eq(installmentTable.productId, productId),
          ne(installmentTable.id, excludeId)
        )
      );

    return Number(result?.total ?? 0);
  },

  deleteInstallmentById: async (db: D1Instance, id: string) => {
    const [result] = await db
      .delete(installmentTable)
      .where(eq(installmentTable.id, id))
      .returning();

    return result;
  },
};