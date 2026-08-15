// src/modules/customer/customer-schema.ts
import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { customerTable } from "./customer-table";
import z from "zod";

const RULES = {
  serialNumber: 1,
  name: 1,
};

export const baseCustomerSchema = createInsertSchema(customerTable, {
  serialNumber: (s) => s.min(RULES.serialNumber, "সিরিয়াল নম্বর আবশ্যক"),
  name: (s) => s.min(RULES.name, "গ্রাহকের নাম আবশ্যক"),
  guardianName: () => z.string().optional().nullable(),
  guardianType: () => z.enum(["father", "husband"]).optional().nullable(),
  phoneNumber: () => z.string().optional().nullable(),
  address: () => z.string().optional().nullable(), // Clean optional string
}).omit({
  createdAt: true,
  createdByName: true,
});

export const insertCustomerSchema = baseCustomerSchema.extend({
  id: baseCustomerSchema.shape.id.optional(),
});

export const updateCustomerSchema = baseCustomerSchema.partial().extend({
  id: z.string(),
});

export const selectCustomerSchema = createSelectSchema(customerTable);