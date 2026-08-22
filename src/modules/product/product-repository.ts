import { eq } from "drizzle-orm";
import { productTable } from "./product-table";
import type { D1Instance } from "@/utils";
import type { InsertProduct, UpdateProduct } from "./product-types";

export const productRepository = {
  createProduct: async (db: D1Instance, data: InsertProduct) => {
    const { id, ...rest } = data as any;
    const [result] = await db
      .insert(productTable)
      .values(rest)
      .returning();
    return result;
  },

  findProductsByCustomerId: async (db: D1Instance, customerId: string) => {
    return await db
      .select()
      .from(productTable)
      .where(eq(productTable.customerId, customerId));
  },

  findCustomerProductById: async (db: D1Instance, id: string) => {
    const results = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, id));

    return results[0] || null;
  },

  updateProductById: async (db: D1Instance, id: string, data: UpdateProduct) => {
    const [result] = await db
      .update(productTable)
      .set(data as any)
      .where(eq(productTable.id, id))
      .returning();

    return result;
  },

  deleteProductById: async (db: D1Instance, id: string) => {
    const [result] = await db
      .delete(productTable)
      .where(eq(productTable.id, id))
      .returning();

    return result;
  },
};