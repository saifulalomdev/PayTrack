import { eq } from "drizzle-orm";
import  { productTable } from "./product-table";
import type { D1Instance } from "@/utils";

export const createCustomerProduct = async (
  db: D1Instance,
  data: undefined
) => {
  const [result] = await db
    .insert(productTable)
    .values(data as any)
    .returning();
  return result;
};

export const findCustomerProductsByCustomerId = async (
  db: D1Instance,
  customerId: string
) => {
  return await db
    .select()
    .from(productTable)
    .where(eq(productTable.customerId, customerId));
};

export const findCustomerProductById = async (db: D1Instance, id: string) => {
  const results = await db
    .select()
    .from(productTable)
    .where(eq(productTable.id, id));

  return results[0] || null;
};