// src/modules/customer/customer-types.ts

import { z } from "zod";
import { insertCustomerSchema, selectCustomerSchema, updateCustomerSchema } from "./customer-schema";

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type SelectCustomer = z.infer<typeof selectCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;

/**
 * Customer has no sensitive field (unlike staff's password hash), so the
 * client-facing shape is identical to the DB row.
 */
export type PublicCustomer = SelectCustomer;

export type NewCustomer = InsertCustomer & { createdByName: string };