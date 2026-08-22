// src/modules/fine/fine-actions.ts
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { fineService } from "./fine-service";
import { insertFineSchema, updateFineSchema } from "./fine-schema";

// CREATE — any logged-in staff can add a fine.
// productId is merged into the schema here (rather than typed by the
// client) because it comes from the page route param, not a form field.
export const createFine = defineAction({
  accept: "json",
  input: insertFineSchema.extend({ productId: z.string() }),
  handler: async (input, context) => {
    const staff = requireAuth(context);
    const { productId, ...rest } = input;
    const db = getDb(env);
    const newFine = await fineService.createFine(db, rest, productId, staff.name);
    return { success: true, message: "জরিমানা সফলভাবে যোগ করা হয়েছে!", data: newFine };
  },
});

// LIST / GET — any logged-in staff can see fines
export const listFines = defineAction({
  accept: "json",
  handler: async (_, context) => {
    requireAuth(context);
    const db = getDb(env);
    return { success: true, data: await fineService.listAll(db) };
  },
});

export const getFine = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    const row = await fineService.getById(db, input.id);
    if (!row) throw new ActionError({ code: "NOT_FOUND", message: "জরিমানা পাওয়া যায়নি।" });
    return { success: true, data: row };
  },
});

export const listFinesByProduct = defineAction({
  accept: "json",
  input: z.object({ productId: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);
    const db = getDb(env);
    return { success: true, data: await fineService.listByProductId(db, input.productId) };
  },
});

export const updateFine = defineAction({
  accept: "json",
  input: updateFineSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const { id, ...data } = input;
    if (!id) throw new ActionError({ code: "BAD_REQUEST", message: "আইডি প্রয়োজন।" });
    const db = getDb(env);
    const row = await fineService.updateFine(db, id, data);
    return { success: true, message: "জরিমানা সফলভাবে আপডেট করা হয়েছে!", data: row };
  },
});

export const deleteFine = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);
    const deleted = await fineService.deleteFine(db, input.id);
    return { success: true, message: "জরিমানা সফলভাবে মুছে ফেলা হয়েছে।", data: deleted };
  },
});