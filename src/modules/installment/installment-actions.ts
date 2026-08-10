// src/modules/installment/installment-actions.ts
import { insertInstallmentSchema } from "./installment-schema";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { installmentService } from "./installment-service";
import {defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";
import { z } from "zod";

// CREATE INSTALLMENT — any logged-in staff (admin or staff) can record a payment.
export const createInstallment = defineAction({
  accept: "json",
  input: insertInstallmentSchema,
  handler: async (input, context) => {
    const staff = requireAuth(context);
    const db = getDb(env);

    // createdByName is taken from the session, never from client input —
    // same pattern as customerService.createCustomer.
    const newInstallment = await installmentService.create(db, input);

    return {
      success: true,
      message: "কিস্তি সফলভাবে যোগ করা হয়েছে!",
      data: newInstallment,
    };
  },
});

// LIST INSTALLMENTS BY PRODUCT — any logged-in staff (admin or staff) can view
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

// GET BALANCE — remaining amount owed for a product. Any logged-in staff can view.
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

// DELETE INSTALLMENT — admin only. Staff can record payments but can never
// remove a payment record, same restriction tier as deleteCustomer.
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