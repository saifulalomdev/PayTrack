// src/modules/installment/installment.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { installmentTable } from "./installment.table";
import z from "zod";

// Base insert shape. `createdByName` is omitted — server-injected from the
// authenticated staff's session, never trusted from client input.
// `customerId` IS kept here: it's required to know which customer this
// installment belongs to, but in practice it's supplied by the page
// (e.g. the customer's detail route), not typed by the user in a form
// field — see AddNewInstallment, which passes it in as a fixed prop.
const baseInstallmentSchema = createInsertSchema(installmentTable, {
    customerId: (s) => s.min(1, `গ্রাহক আইডি আবশ্যক`),
    amount: (s) => s.positive(`কিস্তির পরিমাণ অবশ্যই ধনাত্মক সংখ্যা হতে হবে`),
}).omit({
    createdAt: true,
    createdByName: true,
});

export const insertInstallmentSchema = baseInstallmentSchema.extend({
    id: baseInstallmentSchema.shape.id.optional(),
});

// UPDATE: admin-only (enforced in the action layer via requireAdmin).
// Everything optional EXCEPT id.
export const updateInstallmentSchema = baseInstallmentSchema.partial().extend({
    id: z.string(),
});

export const selectInstallmentSchema = createSelectSchema(installmentTable);