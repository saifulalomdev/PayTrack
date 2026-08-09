// src/modules/customer/customer.schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { customerTable } from "./customer-table";
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
    serialNumber: (s) => s.min(RULES.serialNumber, `সিরিয়াল নম্বর আবশ্যক`),

    name: (s) => s.min(RULES.name, `গ্রাহকের নাম আবশ্যক`)
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