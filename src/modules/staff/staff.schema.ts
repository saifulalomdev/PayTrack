import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { staffTable } from "./staff.table";

const RULES = {
    password: { min: 8, max: 30 },
    phoneNumber: 11
}

export const insertStaffSchema = createInsertSchema(staffTable, {
    id: (s)=> s.optional(),
    phoneNumber: (s) =>
        s.length(RULES.phoneNumber, `Phone number must be ${RULES.phoneNumber} digits`),
    password: (s) => s
        .min(RULES.password.min, `Password must be at least ${RULES.password.min} characters`)
        .max(RULES.password.max, `Password cannot exceed ${RULES.password.max} characters`),
}).omit({
    createdAt: true,
});

// Schema for reading staff (selecting data)
export const selectStaffSchema = createSelectSchema(staffTable);