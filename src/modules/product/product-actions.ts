import { defineAction } from "astro:actions";
import { productService } from "./product-service";
import {
  insertProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from "./product-schema";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";

export const createProduct = defineAction({
  accept: "json",
  input: insertProductSchema,
  handler: async (input, context) => {
    const user = requireAuth(context);
    const db = getDb(env);

    const productData = {
      ...input,
      createdByName: user.name,
    };

    const newProduct = await productService.create(db, productData);

    return {
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    };
  },
});

export const updateProduct = defineAction({
  accept: "json",
  input: updateProductSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);

    const { id, ...data } = input;
    const updated = await productService.update(db, id, data);

    return {
      success: true,
      message: "Product updated successfully!",
      data: updated,
    };
  },
});

export const deleteProduct = defineAction({
  accept: "json",
  input: deleteProductSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);

    await productService.delete(db, input.id);

    return {
      success: true,
      message: "Product deleted successfully!",
    };
  },
});