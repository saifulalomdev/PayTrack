// src/modules/installment/installment-repository.ts
import { eq, sum } from "drizzle-orm";
import { installmentTable } from "./installment-table";
import type { D1Instance } from "@/utils";
import type { InsertInstallment } from "./installment-types";

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

  getTotalPaidByProductId: async (db: D1Instance, productId: string) => {
    const [result] = await db
      .select({ total: sum(installmentTable.amountPaid) })
      .from(installmentTable)
      .where(eq(installmentTable.productId, productId));

    // sum() returns a string or null from sqlite — normalize to number
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