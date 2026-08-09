import type { D1Instance } from "@/utils";
import {
  createCustomerProduct,
  findCustomerProductsByCustomerId,
} from "./product-repository";

export const addProductToCustomer = async (
  db: D1Instance,
  input: any
) => {
  return await createCustomerProduct(db, input);
};

export const getProductsByCustomer = async (
  db: D1Instance,
  customerId: string
) => {
  return await findCustomerProductsByCustomerId(db, customerId);
};