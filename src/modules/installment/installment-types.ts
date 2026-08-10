// src/modules/installment/installment-types.ts
import { z } from "zod";
import { insertInstallmentSchema, selectInstallmentSchema } from "./installment-schema";

export type InsertInstallment = z.infer<typeof insertInstallmentSchema>;
export type SelectInstallment = z.infer<typeof selectInstallmentSchema>;
export type PublicInstallment = SelectInstallment;