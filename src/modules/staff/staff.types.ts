import { z } from "zod"; 
import { insertStaffSchema, selectStaffSchema } from "./staff.schema";

export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type SelectStaff = z.infer<typeof selectStaffSchema>;