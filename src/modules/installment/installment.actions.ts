// src/modules/installment/installment.actions.ts

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { installmentService } from "./installment.service";
import { insertInstallmentSchema, updateInstallmentSchema } from "./installment.schema";

// CREATE INSTALLMENT — any logged-in staff (admin or staff) can log a payment.
export const createInstallment = defineAction({
  accept: "json",
  input: insertInstallmentSchema,
  handler: async (input, context) => {
    const staff = requireAuth(context);

    const db = getDb(env);
    const newInstallment = await installmentService.createInstallment(db, input, staff.name);

    return { success: true, message: "কিস্তি সফলভাবে যোগ করা হয়েছে!", data: newInstallment };
  },
});

// LIST INSTALLMENTS FOR A CUSTOMER — any logged-in staff can view
export const listInstallmentsByCustomer = defineAction({
  accept: "json",
  input: z.object({ customerId: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);

    const db = getDb(env);
    const installments = await installmentService.listByCustomer(db, input.customerId);

    return { success: true, data: installments };
  },
});

// GET INSTALLMENT BY ID — any logged-in staff can view
export const getInstallment = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);

    const db = getDb(env);
    const installment = await installmentService.getById(db, input.id);

    if (!installment) {
      throw new ActionError({ code: "NOT_FOUND", message: "কিস্তির তথ্য পাওয়া যায়নি।" });
    }

    return { success: true, data: installment };
  },
});

// UPDATE INSTALLMENT — admin only. Staff can add installments but can never edit them.
export const updateInstallment = defineAction({
  accept: "json",
  input: updateInstallmentSchema,
  handler: async (input, context) => {
    requireAdmin(context);

    if (!input.id) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "আপডেট করার জন্য কিস্তির আইডি প্রয়োজন।",
      });
    }

    const db = getDb(env);
    const installment = await installmentService.updateInstallment(db, input.id, input);

    return { success: true, message: "কিস্তির তথ্য সফলভাবে আপডেট করা হয়েছে!", data: installment };
  },
});

// DELETE INSTALLMENT — admin only. Staff can add installments but can never delete them.
export const deleteInstallment = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);

    const db = getDb(env);
    const deletedInstallment = await installmentService.deleteInstallment(db, input.id);

    return { success: true, message: "কিস্তি সফলভাবে মুছে ফেলা হয়েছে।", data: deletedInstallment };
  },
});