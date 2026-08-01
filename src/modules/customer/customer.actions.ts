// src/modules/customer/customer.actions.ts

import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { requireAdmin, requireAuth } from "@/utils/auth-guards";
import { customerService } from "./customer.service";
import { insertCustomerSchema, updateCustomerSchema } from "./customer.schema";

// NOTE: `requireAuth` should exist alongside `requireAdmin` in
// "@/utils/auth-guards" — same session/cookie check, just WITHOUT the
// `role === 'admin'` restriction (i.e. it allows both 'admin' and 'staff').
// It's expected to return the authenticated staff's session data
// (at least { id, name, role }), same shape you already build the session
// cookie from in staff.actions.ts. If it doesn't exist yet, add it next to
// requireAdmin — this module is the first to need the "any logged-in
// staff" tier instead of "admin only".

// CREATE CUSTOMER — any logged-in staff (admin or staff) can add a customer.
export const createCustomer = defineAction({
  accept: "json",
  input: insertCustomerSchema,
  handler: async (input, context) => {
    const staff = requireAuth(context);

    const db = getDb(env);
    // createdByName is taken from the session, never from client input —
    // see the comment on customerService.createCustomer.
    const newCustomer = await customerService.createCustomer(db, input, staff.name);

    return { success: true, message: "গ্রাহক সফলভাবে যোগ করা হয়েছে!", data: newCustomer };
  },
});

// GET CUSTOMER BY ID — any logged-in staff (admin or staff) can view
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

// UPDATE CUSTOMER — admin only. Staff can add customers but can never edit them.
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

// DELETE CUSTOMER — admin only. Staff can add customers but can never delete them.
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

// LIST CUSTOMERS — any logged-in staff (admin or staff) can view/search
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