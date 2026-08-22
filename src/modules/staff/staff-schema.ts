// src/modules/staff/staff-schema.ts

import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod";
import { staffTable } from "./staff-table";
import { z } from "zod";

const RULES = {
  password: { min: 8, max: 30 },
  phoneNumber: 11,
  name: 1,
};

const baseStaffSchema = createInsertSchema(staffTable, {
  name: (s) => s.trim().min(RULES.name, "নাম কমপক্ষে ১ অক্ষরের হতে হবে"),
  phoneNumber: (s) =>
    s
      .trim()
      .regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন"),
}).omit({
  createdAt: true,
  password: true,
});

const passwordRule = z
  .string()
  .min(RULES.password.min, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে")
  .max(RULES.password.max, "পাসওয়ার্ড সর্বোচ্চ ৩০ অক্ষরের হতে পারে");

export const insertStaffSchema = baseStaffSchema.extend({
  id: baseStaffSchema.shape.id.optional(),
  password: passwordRule,
});

// Transforms empty strings "" to undefined so password isn't overwritten accidentally
export const updateStaffSchema = baseStaffSchema.partial().extend({
  id: z.string().min(1, "স্টাফ আইডি প্রয়োজন"),
  password: passwordRule
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

export const selectStaffSchema = createSelectSchema(staffTable);