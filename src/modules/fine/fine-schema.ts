// src/modules/fine/fine.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { fineTable } from "./fine-table";
import z from "zod";

const RULES = {
    amount: 1,
    note: 1,
}

// Base shape WITHOUT productId — productId comes from the route param
// (/fine/[productId]/new), not client form input, so it's handled the
// same way as `createdByName`: server-injected, never trusted from the
// form body. `createdAt` is likewise omitted as always.
const baseFineSchema = createInsertSchema(fineTable, {
    amount: (s) =>
        s.min(RULES.amount, `জরিমানার পরিমাণ আবশ্যক`),

    note: (s) =>
        s.min(RULES.note, `নোট আবশ্যক`),
}).omit({
    createdAt: true,
    createdByName: true,
    productId: true,
});

export const insertFineSchema = baseFineSchema.extend({
    id: baseFineSchema.shape.id.optional(),
});

// UPDATE: admin-only (enforced in the action layer via requireAdmin).
// Everything optional EXCEPT id.
export const updateFineSchema = baseFineSchema.partial().extend({
    id: z.string(),
});

export const selectFineSchema = createSelectSchema(fineTable);