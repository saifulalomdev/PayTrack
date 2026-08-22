import { z } from "zod";
import {
  deleteProductSchema,
  insertProductSchema,
  selectProductSchema,
  updateProductSchema,
} from "./product-schema";

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type SelectProduct = z.infer<typeof selectProductSchema>;
export type UpdateProduct = Omit<z.infer<typeof updateProductSchema>, "id">;

export type PublicProduct = SelectProduct;
export type NewProduct = InsertProduct & { createdByName: string };
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;