import { ActionError, defineAction } from "astro:actions";
import { z } from "zod";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { loginSchema } from "../auth/auth-schema";
import { requireAdmin } from "@/utils/auth-guards";
import { staffService } from "./staff-service";
import { insertStaffSchema, updateStaffSchema } from "./staff-schema";
import { buildSessionCookieValue, SESSION_COOKIE_NAME } from "@/utils/auth";

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

export const updateStaff = defineAction({
  accept: "json",
  input: updateStaffSchema,
  handler: async (input, context) => {
    requireAdmin(context);

    const db = getDb(env);
    const { staff } = await staffService.updateStaff(db, input.id, input);

    return { success: true, message: "স্টাফ তথ্য সফলভাবে আপডেট করা হয়েছে!", data: staff };
  },
});

export const loginStaff = defineAction({
  accept: "json",
  input: loginSchema,
  handler: async (input, context) => {
    const db = getDb(env);
    const staff = await staffService.login(db, input.phoneNumber, input.password);

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

export const logoutStaff = defineAction({
  accept: "json",
  handler: async (_, context) => {
    context.cookies.delete(SESSION_COOKIE_NAME, { path: "/" });
    return { success: true, message: "সফলভাবে লগআউট করা হয়েছে।" };
  },
});

export const deleteStaff = defineAction({
  accept: "json",
  input: z.object({ id: z.string().min(1, "আইডি প্রয়োজন") }),
  handler: async (input, context) => {
    const currentAdmin = requireAdmin(context);

    // Prevent admin self-deletion
    if (currentAdmin.id === input.id) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "আপনি নিজের অ্যাকাউন্ট মুছে ফেলতে পারবেন না।",
      });
    }

    const db = getDb(env);
    const deletedStaff = await staffService.deleteStaff(db, input.id);

    return { success: true, message: "স্টাফ সফলভাবে মুছে ফেলা হয়েছে।", data: deletedStaff };
  },
});