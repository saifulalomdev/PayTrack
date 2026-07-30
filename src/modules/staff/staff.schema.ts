// src/modules/staff/staff.schema.ts

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { staffTable } from "./staff.table";
import z from "zod";

const RULES = {
    password: { min: 8, max: 30 },
    phoneNumber: 11,
    name: 1
}

// Shared shape, WITHOUT password — each use case defines its own password rule
const baseStaffSchema = createInsertSchema(staffTable, {
    name: (s) =>
        s.min(RULES.name, `নাম কমপক্ষে ১ অক্ষরের হতে হবে`),

    phoneNumber: (s) =>
        s.length(RULES.phoneNumber, `মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে`),
}).omit({
    createdAt: true,
    password: true,
});

const passwordRule = z
    .string()
    .min(RULES.password.min, `পাসওয়ার্ড কমপক্ষে ৮  অক্ষরের হতে হবে`)
    .max(RULES.password.max, `পাসওয়ার্ড সর্বোচ্চ ৩০  অক্ষরের হতে পারে`);

export const insertStaffSchema = baseStaffSchema.extend({
    id: baseStaffSchema.shape.id.optional(),
    password: passwordRule,
});

// UPDATE: everything optional EXCEPT id (need it to know which record to update),
// and password stays optional (only update if provided)
export const updateStaffSchema = baseStaffSchema.partial().extend({
    id: z.string(),
    password: passwordRule.optional().or(z.literal("")),
});

// Schema for reading staff (selecting data)
export const selectStaffSchema = createSelectSchema(staffTable);