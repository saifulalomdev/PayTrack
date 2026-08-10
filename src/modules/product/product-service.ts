// src/modules/product/product-service.ts
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
      throw new Error("পণ্যটি খুঁজে পাওয়া যায়নি।");
    }

    return product;
  },

  update: async (db: D1Instance, data: UpdateProduct) => {
    // Guard: the product must exist and belong to the customerId being
    // submitted, so one customer's product can't be silently reassigned
    // or edited via a spoofed customerId in the form payload.
    const existing = await productRepository.findCustomerProductById(db, data.id);

    if (!existing) {
      throw new Error("পণ্যটি খুঁজে পাওয়া যায়নি।");
    }

    if (existing.customerId !== data.customerId) {
      throw new Error("এই পণ্যটি এই গ্রাহকের নয়।");
    }

    const updated = await productRepository.updateProductById(db, data);

    if (!updated) {
      throw new Error("পণ্য আপডেট করা যায়নি।");
    }

    return updated;
  },

  delete: async (db: D1Instance, id: string) => {
    const deleted = await productRepository.deleteProductById(db, id);

    if (!deleted) {
      throw new Error("পণ্যটি খুঁজে পাওয়া যায়নি।");
    }

    return deleted;
  },
};