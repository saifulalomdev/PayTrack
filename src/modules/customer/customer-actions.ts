// src/modules/customer/customer-actions.ts

import { insertCustomerSchema, updateCustomerSchema } from "./customer-schema";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { ActionError, defineAction } from "astro:actions";
import { customerService } from "./customer-service";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";
import { z } from "zod";

export const createCustomer = defineAction({
  accept: "json",
  input: insertCustomerSchema,
  handler: async (input, context) => {
    const staff = requireAuth(context);

    const db = getDb(env);
    const newCustomer = await customerService.createCustomer(db, input, staff.name);

    return { success: true, message: "গ্রাহক সফলভাবে যোগ করা হয়েছে!", data: newCustomer };
  },
});

export const getCustomer = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAuth(context);

    const db = getDb(env);
    const customer = await customerService.getById(db, input.id);

    if (!customer) {
      throw new ActionError({ code: "NOT_FOUND", message: "গ্রাহক পাওয়া যায়নি।" });
    }

    return { success: true, data: customer };
  },
});

export const updateCustomer = defineAction({
  accept: "json",
  input: updateCustomerSchema,
  handler: async (input, context) => {
    requireAdmin(context);

    if (!input.id) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "আপডেট করার জন্য গ্রাহক আইডি প্রয়োজন।",
      });
    }

    const db = getDb(env);
    const customer = await customerService.updateCustomer(db, input.id, input);

    return { success: true, message: "গ্রাহকের তথ্য সফলভাবে আপডেট করা হয়েছে!", data: customer };
  },
});

export const deleteCustomer = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);

    const db = getDb(env);
    const deletedCustomer = await customerService.deleteCustomer(db, input.id);

    return { success: true, message: "গ্রাহক সফলভাবে মুছে ফেলা হয়েছে।", data: deletedCustomer };
  },
});

export const listCustomers = defineAction({
  accept: "json",
  input: z
    .object({
      search: z.string().optional(),
      page: z.number().int().min(1).optional(),
      pageSize: z.number().int().min(1).max(100).optional(),
    })
    .optional(),
  handler: async (input, context) => {
    requireAuth(context);

    const db = getDb(env);
    const { data, pagination } = await customerService.listAll(db, input ?? {});

    return { success: true, data, pagination };
  },
});