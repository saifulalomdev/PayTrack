// src/modules/installment/installment-actions.ts
import { insertInstallmentSchema, updateInstallmentSchema } from "./installment-schema";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { installmentService } from "./installment-service";
import { defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";
import { z } from "zod";

// CREATE — any logged-in staff can record a payment.
export const createInstallment = defineAction({
  accept: "json",
  input: insertInstallmentSchema,
  handler: async (input, context) => {
    // 1. Get the logged-in user/staff member
    const user = requireAuth(context); 
    const db = getDb(env);

    // 2. Separate 'id' so Drizzle can auto-generate a new UUID
    const { id, ...installmentData } = input;

    // 3. Pass createdByName from the logged-in user
    const newInstallment = await installmentService.create(db, {
      ...installmentData,
      createdByName: user.name,
    });

    return {
      success: true,
      message: "কিস্তি সফলভাবে যোগ করা হয়েছে!",
      data: newInstallment,
    };
  },
});

// LIST BY PRODUCT — any logged-in staff can view.
export const listInstallments = defineAction({
  accept: "json",
  input: z.object({ productId: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    const installments = await installmentService.listByProductId(db, input.productId);
    return { success: true, data: installments };
  },
});

// GET SINGLE — used to populate the edit form.
export const getInstallment = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    const installment = await installmentService.getById(db, input.id);
    return { success: true, data: installment };
  },
});

// GET BALANCE — remaining amount owed for a product.
export const getInstallmentBalance = defineAction({
  accept: "json",
  input: z.object({ productId: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    const balance = await installmentService.getBalance(db, input.productId);
    return { success: true, data: balance };
  },
});

// UPDATE — admin only. Editing a recorded payment is sensitive, same
// restriction tier as delete.
export const updateInstallment = defineAction({
  accept: "json",
  input: updateInstallmentSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);
    const updated = await installmentService.update(db, input);
    return {
      success: true,
      message: "কিস্তি সফলভাবে আপডেট হয়েছে!",
      data: updated,
    };
  },
});

// DELETE — admin only.
export const deleteInstallment = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);
    const deletedInstallment = await installmentService.delete(db, input.id);
    return {
      success: true,
      message: "কিস্তি সফলভাবে মুছে ফেলা হয়েছে।",
      data: deletedInstallment,
    };
  },
});