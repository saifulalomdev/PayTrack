// src/actions/staff.actions.ts
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { insertStaffSchema, updateStaffSchema } from "./staff.schema";
import { staffRepository } from "./staff.repository";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";
import { hashPassword, verifyPassword } from "@/utils/password";
import { loginSchema } from "../auth/auth.schema";

const SESSION_COOKIE_NAME = "staff_session";

// CREATE STAFF
export const createStaff = defineAction({
  accept: "json",
  input: insertStaffSchema,
  handler: async (input) => {
    const db = getDb(env);

    // Check if phone number already exists
    const existingStaff = await staffRepository.findByPhoneNumber(db, input.phoneNumber);
    if (existingStaff) {
      throw new ActionError({
        code: "CONFLICT",
        message: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যেই একজন স্টাফ তৈরি করা হয়েছে।",
      });
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(input.password);

    const newStaff = await staffRepository.create(db, {
      ...input,
      password: hashedPassword,
    });

    return { success: true, message: "স্টাফ সফলভাবে তৈরি করা হয়েছে!", data: newStaff };
  },
});

// UPDATE STAFF
export const updateStaff = defineAction({
  accept: "json",
  input: updateStaffSchema,
  handler: async (input, context) => {
    const db = getDb(env);
    const { id, password, phoneNumber, ...otherData } = input;

    if (!id) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "আপডেট করার জন্য স্টাফ আইডি প্রয়োজন।",
      });
    }

    // Check if staff exists
    const existingStaff = await staffRepository.findById(db, id);
    if (!existingStaff) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "স্টাফ পাওয়া যায়নি।",
      });
    }

    const updatePayload: Record<string, any> = { ...otherData };
    let credentialsChanged = false;

    // Check if phone number changed
    if (phoneNumber && phoneNumber !== existingStaff.phoneNumber) {
      updatePayload.phoneNumber = phoneNumber;
      credentialsChanged = true;
    }

    // Check if password changed and hash it
    if (password) {
      updatePayload.password = await hashPassword(password);
      credentialsChanged = true;
    }

    // If sensitive credentials changed, destroy the user's session cookie
    if (credentialsChanged) {
      context.cookies.delete(SESSION_COOKIE_NAME, {
        path: "/",
      });
    }

    const updatedStaff = await staffRepository.update(db, id, updatePayload);
    return { success: true, message: "স্টাফ তথ্য সফলভাবে আপডেট করা হয়েছে!", data: updatedStaff };
  },
});

// LOGIN STAFF
export const loginStaff = defineAction({
  accept: "json",
  input: loginSchema,
  handler: async (input, context) => {
    const db = getDb(env);

    // Find staff by phone number
    const staff = await staffRepository.findByPhoneNumber(db, input.phoneNumber);
    if (!staff) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(input.password, staff.password);
    if (!isValidPassword) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
      });
    }

    // Set secure HTTP-only cookie
    context.cookies.set(SESSION_COOKIE_NAME, staff.id, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { 
      success: true, 
      message: "সফলভাবে লগইন করা হয়েছে!", 
      data: { id: staff.id, name: staff.name, role: staff.role } 
    };
  },
});

// LOGOUT STAFF
export const logoutStaff = defineAction({
  accept: "json",
  handler: async (_, context) => {
    context.cookies.delete(SESSION_COOKIE_NAME, {
      path: "/",
    });

    return { success: true, message: "সফলভাবে লগআউট করা হয়েছে।" };
  },
});

// DELETE STAFF
export const deleteStaff = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input) => {
    const db = getDb(env);

    const existingStaff = await staffRepository.findById(db, input.id);
    if (!existingStaff) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "স্টাফ পাওয়া যায়নি।",
      });
    }

    const deletedStaff = await staffRepository.delete(db, input.id);
    return { success: true, message: "স্টাফ সফলভাবে মুছে ফেলা হয়েছে।", data: deletedStaff };
  },
});