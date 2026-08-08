// src/modules/staff/staff.actions.ts

import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { loginSchema } from "../auth/auth-schema";
import { requireAdmin } from "@/utils/auth-guards";
import { staffService } from "./staff-service";
import { insertStaffSchema, updateStaffSchema } from "./staff-schema";
import { buildSessionCookieValue, SESSION_COOKIE_NAME } from "@/utils/auth";

// CREATE STAFF — admin only
export const createStaff = defineAction({
  accept: "json",
  input: insertStaffSchema,
  handler: async (input, context) => {
    requireAdmin(context);

    const db = getDb(env);
    const newStaff = await staffService.createStaff(db, input);

    return { success: true, message: "স্টাফ সফলভাবে তৈরি করা হয়েছে!", data: newStaff };
  },
});

// // UPDATE STAFF — admin only
export const updateStaff = defineAction({
  accept: "json",
  input: updateStaffSchema,
  handler: async (input, context) => {
    requireAdmin(context);

    if (!input.id) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "আপডেট করার জন্য স্টাফ আইডি প্রয়োজন।",
      });
    }

    const db = getDb(env);
    const { staff } = await staffService.updateStaff(db, input.id, input);

    // No cookie-delete here anymore: deleting the cookie only affects the
    // caller (the admin), not the staff member whose credentials changed.
    // Real invalidation now happens via tokenVersion inside staffService —
    // it's checked in getAuthenticatedStaff on every request, so every
    // existing session belonging to THAT staff member is invalidated
    // automatically, regardless of whose browser is calling this action.

    return { success: true, message: "স্টাফ তথ্য সফলভাবে আপডেট করা হয়েছে!", data: staff };
  },
});

// LOGIN STAFF — public, no guard
export const loginStaff = defineAction({
  accept: "json",
  input: loginSchema,
  handler: async (input, context) => {
    const db = getDb(env);
    const staff = await staffService.login(db, input.phoneNumber, input.password);

    // Cookie now encodes "<id>:<tokenVersion>" instead of a raw id, so that
    // a later credential change (which bumps tokenVersion) invalidates this
    // exact cookie value on next request — see getAuthenticatedStaff.
    context.cookies.set(SESSION_COOKIE_NAME, buildSessionCookieValue(staff), {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: "সফলভাবে লগইন করা হয়েছে!",
      data: { id: staff.id, name: staff.name, role: staff.role },
    };
  },
});

// LOGOUT STAFF — public
export const logoutStaff = defineAction({
  accept: "json",
  handler: async (_, context) => {
    context.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
    return { success: true, message: "সফলভাবে লগআউট করা হয়েছে।" };
  },
});

// DELETE STAFF — admin only
export const deleteStaff = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input, context) => {
    requireAdmin(context);

    const db = getDb(env);
    const deletedStaff = await staffService.deleteStaff(db, input.id);

    return { success: true, message: "স্টাফ সফলভাবে মুছে ফেলা হয়েছে।", data: deletedStaff };
  },
});