// src/modules/staff/staff.types.ts

import { z } from "zod";
import { insertStaffSchema, selectStaffSchema, updateStaffSchema } from "./staff-schema";

export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type SelectStaff = z.infer<typeof selectStaffSchema>;
export type UpdateStaff = z.infer<typeof updateStaffSchema>;

/**
 * Staff shape safe to send to the client — excludes the password hash.
 * Use this as the return type anywhere staff data crosses the
 * action → client boundary (create/update/delete/list responses).
 * Never use SelectStaff directly in an action's `data` payload.
 */
export type PublicStaff = Omit<SelectStaff, "password">;