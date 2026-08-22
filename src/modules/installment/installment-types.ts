// src/modules/installment/installment-types.ts
import { z } from "zod";
import {
  deleteInstallmentSchema,
  insertInstallmentSchema,
  selectInstallmentSchema,
  updateInstallmentSchema,
} from "./installment-schema";

export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;
export type SelectInstallment = z.infer<typeof selectInstallmentSchema>;
export type UpdateInstallment = Omit<z.infer<typeof updateInstallmentSchema>, "id">;

/** No sensitive fields — client-facing shape matches the DB row. */
export type PublicInstallment = SelectInstallment;
export type NewInstallment = InsertInstallment & { createdByName: string };
export type DeleteInstallmentInput = z.infer<typeof deleteInstallmentSchema>;