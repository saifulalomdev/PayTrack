// src/modules/installment/installment-schema.ts
import { createSelectSchema, createInsertSchema } from 'drizzle-orm/zod';
import { installmentTable } from './installment-table';
import { z } from 'zod';

export const selectInstallmentSchema = createSelectSchema(installmentTable).strict();

export const insertInstallmentSchema = createInsertSchema(installmentTable, {
  id: (s) => s.optional(),
  paidAt: (s) => s.optional(),
  createdAt: (s) => s.optional(),
  createdByName: (s) => s.optional(), // injected server-side from session

  productId: z.string(),

  amountPaid: z.number().positive({ message: "পরিশোধিত পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে।" }),
}).strict();