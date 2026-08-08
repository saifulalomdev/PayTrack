import { eq } from "drizzle-orm";
import { customerProductTable } from "./product-table";
import { NewCustomerProduct } from "./product-types";
import { D1Instance } from "@/utils";

export const createCustomerProduct = async (
  db: D1Instance,
  data: NewCustomerProduct
) => {
  const [result] = await db
    .insert(customerProductTable)
    .values(data)
    .returning();
  return result;
};

export const findCustomerProductsByCustomerId = async (
  db: D1Instance,
  customerId: string
) => {
  return await db
    .select()
    .from(customerProductTable)
    .where(eq(customerProductTable.customerId, customerId));
};

export const findCustomerProductById = async (db: D1Instance, id: string) => {
  const results = await db
    .select()
    .from(customerProductTable)
    .where(eq(customerProductTable.id, id));

  return results[0] || null;
};