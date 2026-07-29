// src/actions/staff.actions.ts
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { insertStaffSchema } from "./staff.schema";
import { staffRepository } from "./staff.repository";
import { getDb } from "@/utils";
import { env } from "cloudflare:workers";

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
        message: "A staff member with this phone number already exists.",
      });
    }

    const newStaff = await staffRepository.create(db, input);
    return { success: true, data: newStaff };
  },
});

// UPDATE STAFF
export const updateStaff = defineAction({
  accept: "json",
  input: z.object({
    id: z.string(),
    data: insertStaffSchema.partial(),
  }),
  handler: async (input) => {
    
    const db = getDb(env);

    // Check if staff exists
    const existingStaff = await staffRepository.findById(db, input.id);
    if (!existingStaff) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Staff member not found.",
      });
    }

    const updatedStaff = await staffRepository.update(db, input.id, input.data);
    return { success: true, data: updatedStaff };
  },
});

// DELETE STAFF
export const deleteStaff = defineAction({
  accept: "json",
  input: z.object({ id: z.string() }),
  handler: async (input) => {
    
    const db = getDb(env);

    // Check if staff exists
    const existingStaff = await staffRepository.findById(db, input.id);
    if (!existingStaff) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Staff member not found.",
      });
    }

    const deletedStaff = await staffRepository.delete(db, input.id);
    return { success: true, data: deletedStaff };
  },
});