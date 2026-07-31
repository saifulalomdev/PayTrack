// src/modules/customer/customer.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customerTable } from "./customer.table";
import z from "zod";

const RULES = {
    serialNumber: 1,
    name: 1,
    productName: 1,
}

// Base insert shape. `createdByName` is deliberately omitted here — it is
// never trusted from client input. The action layer fills it in from the
// authenticated staff's own session name (see customer.actions.ts).
const baseCustomerSchema = createInsertSchema(customerTable, {
    serialNumber: (s) =>
        s.min(RULES.serialNumber, `সিরিয়াল নম্বর আবশ্যক`),

    name: (s) =>
        s.min(RULES.name, `গ্রাহকের নাম কমপক্ষে ১ অক্ষরের হতে হবে`),

    productName: (s) =>
        s.min(RULES.productName, `পণ্যের নাম আবশ্যক`),

    totalPrice: (s) => s.positive(`মোট মূল্য অবশ্যই ধনাত্মক সংখ্যা হতে হবে`),
    downPayment: (s) => s.nonnegative(`ডাউন পেমেন্ট ঋণাত্মক হতে পারবে না`),
    installmentAmount: (s) => s.positive(`কিস্তির পরিমাণ অবশ্যই ধনাত্মক সংখ্যা হতে হবে`),
    installmentDeadline: (s) => s.positive(`কিস্তির শেষ তারিখ আবশ্যক`),
}).omit({
    createdAt: true,
    createdByName: true,
});

export const insertCustomerSchema = baseCustomerSchema.extend({
    id: baseCustomerSchema.shape.id.optional(),
});

// UPDATE: admin-only (enforced in the action layer via requireAdmin).
// Everything optional EXCEPT id (need it to know which record to update).
export const updateCustomerSchema = baseCustomerSchema.partial().extend({
    id: z.string(),
});

// Schema for reading customer (selecting data)
export const selectCustomerSchema = createSelectSchema(customerTable);