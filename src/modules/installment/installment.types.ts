// src/modules/installment/installment.types.ts
import { z } from "zod";
import { insertInstallmentSchema, selectInstallmentSchema, updateInstallmentSchema } from "./installment.schema";

export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;
export type SelectInstallment = z.infer<typeof selectInstallmentSchema>;
export type UpdateInstallment = z.infer<typeof updateInstallmentSchema>;

/**
 * No sensitive field on installment, so the client-facing shape is
 * identical to the DB row — kept as its own alias for consistency with
 * PublicStaff / PublicCustomer.
 */
export type PublicInstallment = SelectInstallment;

/**
 * The full row shape the repository actually writes — InsertInstallment
 * plus createdByName, which is never trusted from client input and is
 * instead filled in server-side from the authenticated staff's session
 * (see installment.service.ts / installment.actions.ts).
 */
export type NewInstallment = InsertInstallment & { createdByName: string };