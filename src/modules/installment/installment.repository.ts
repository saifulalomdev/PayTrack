// src/modules/installment/installment.repository.ts
import { D1Instance } from "@/utils";
import { desc, eq } from "drizzle-orm";
import { InsertInstallment, NewInstallment, SelectInstallment } from "./installment.types";
import { installmentTable } from "./installment.table";

export const installmentRepository = {
  /**
   * CREATE: Records a new installment payment.
   * Takes `NewInstallment`, not `InsertInstallment` — the row needs
   * `createdByName`, which never comes from client input.
   */
  async create(db: D1Instance, data: NewInstallment): Promise<SelectInstallment> {
    const [newInstallment] = await db
      .insert(installmentTable)
      .values(data)
      .returning();

    return newInstallment;
  },

  /**
   * UPDATE: Admin-only — enforced in the action/service layer, not here.
   */
  async update(db: D1Instance, id: string, data: Partial<InsertInstallment>): Promise<SelectInstallment> {
    const [updatedInstallment] = await db
      .update(installmentTable)
      .set(data)
      .where(eq(installmentTable.id, id))
      .returning();

    return updatedInstallment;
  },

  /**
   * DELETE: Admin-only — enforced in the action/service layer, not here.
   */
  async delete(db: D1Instance, id: string): Promise<SelectInstallment> {
    const [deletedInstallment] = await db
      .delete(installmentTable)
      .where(eq(installmentTable.id, id))
      .returning();

    return deletedInstallment;
  },

  async findById(db: D1Instance, id: string): Promise<SelectInstallment | null> {
    const [installment] = await db
      .select()
      .from(installmentTable)
      .where(eq(installmentTable.id, id))
      .execute();

    return installment || null;
  },

  /**
   * FIND BY CUSTOMER: Retrieves every installment paid against a given
   * customer, most recent first — this is the customer's payment history.
   */
  async findByCustomerId(db: D1Instance, customerId: string): Promise<SelectInstallment[]> {
    const records = await db
      .select()
      .from(installmentTable)
      .where(eq(installmentTable.customerId, customerId))
      .orderBy(desc(installmentTable.createdAt))
      .execute();

    return records || [];
  },

  async findAll(db: D1Instance): Promise<SelectInstallment[]> {
    const records = await db
      .select()
      .from(installmentTable)
      .orderBy(desc(installmentTable.createdAt))
      .execute();

    return records || [];
  },
};