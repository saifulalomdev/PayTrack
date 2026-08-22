import { productRepository } from "./product-repository";
import type { D1Instance } from "@/utils";
import type { InsertProduct, UpdateProduct } from "./product-types";

export const productService = {
  create: async (db: D1Instance, data: InsertProduct) => {
    return await productRepository.createProduct(db, data);
  },

  listByCustomerId: async (db: D1Instance, customerId: string) => {
    return await productRepository.findProductsByCustomerId(db, customerId);
  },

  getById: async (db: D1Instance, id: string) => {
    const product = await productRepository.findCustomerProductById(db, id);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  },

  update: async (db: D1Instance, id: string, data: UpdateProduct) => {
    const existing = await productRepository.findCustomerProductById(db, id);

    if (!existing) {
      throw new Error("Product not found.");
    }

    if (existing.customerId !== data.customerId) {
      throw new Error("This product does not belong to this customer.");
    }

    const updated = await productRepository.updateProductById(db, id, data);

    if (!updated) {
      throw new Error("Failed to update product.");
    }

    return updated;
  },

  delete: async (db: D1Instance, id: string) => {
    const deleted = await productRepository.deleteProductById(db, id);

    if (!deleted) {
      throw new Error("Product not found.");
    }

    return deleted;
  },
};