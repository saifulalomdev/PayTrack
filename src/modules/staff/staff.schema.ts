// src/modules/staff/staff.schema.ts

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { staffTable } from "./staff.table";

const RULES = {
    password: { min: 8, max: 30 },
    phoneNumber: 11,
    name: 1
}

export const insertStaffSchema = createInsertSchema(staffTable, {
    name: (s) =>
        s.min(RULES.name, `নাম কমপক্ষে ১ অক্ষরের হতে হবে`),

    id: (s) => s.optional(),
    
    phoneNumber: (s) =>
        s.length(RULES.phoneNumber, `মোবাইল নম্বরটি অবশ্যই ১১ ডিজিটের হতে হবে`),
        
    password: (s) => s
        .min(RULES.password.min, `পাসওয়ার্ড কমপক্ষে ৮  অক্ষরের হতে হবে`)
        .max(RULES.password.max, `পাসওয়ার্ড সর্বোচ্চ  অক্ষরের হতে পারে`),
}).omit({
    createdAt: true,
});

// Schema for reading staff (selecting data)
export const selectStaffSchema = createSelectSchema(staffTable);

export const updateStaffSchema = insertStaffSchema.partial();