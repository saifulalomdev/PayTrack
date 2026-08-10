// src/modules/product/product.types.ts
import { z } from "zod";
import { insertProductSchema, selectProductSchema, updateProductSchema } from "./product-schema";

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SelectProduct = z.infer<typeof selectProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

/**
 * Product has no sensitive field, so the client-facing shape is identical
 * to the DB row. Kept as its own alias anyway so the action layer reads
 * consistently with the customer/staff modules (PublicCustomer /
 * PublicStaff), and so there's one place to change if a sensitive field
 * is ever added later.
 */
export type PublicProduct = SelectProduct;

export type NewProduct = InsertProduct & { createdByName: string };