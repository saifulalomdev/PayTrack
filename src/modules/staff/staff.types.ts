// src/modules/staff/staff.types.ts
import { z } from "zod"; 
import { insertStaffSchema, selectStaffSchema, updateStaffSchema } from "./staff.schema";

export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type SelectStaff = z.infer<typeof selectStaffSchema>;

export type UpdateStaff = z.infer<typeof updateStaffSchema>; 