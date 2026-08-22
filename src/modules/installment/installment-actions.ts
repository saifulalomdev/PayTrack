// src/modules/installment/installment-actions.ts
import { defineAction } from 'astro:actions';
import { installmentService } from './installment-service';
import {
  insertInstallmentSchema,
  updateInstallmentSchema,
  deleteInstallmentSchema,
} from './installment-schema';
import { requireAdmin, requireAuth } from '@/utils/auth-guards';
import { getDb } from '@/utils';
import { env } from 'cloudflare:workers';

export const createInstallment = defineAction({
  accept: 'json',
  input: insertInstallmentSchema,
  handler: async (input, context) => {
    const user = requireAuth(context);
    const db = getDb(env);

    const { id, ...installmentData } = input;

    const newInstallment = await installmentService.create(db, {
      ...installmentData,
      createdByName: user.name,
    });

    return {
      success: true,
      message: "Installment added successfully!",
      data: newInstallment,
    };
  },
});

export const updateInstallment = defineAction({
  accept: 'json',
  input: updateInstallmentSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);

    const { id, ...data } = input;
    const updated = await installmentService.update(db, id, data);

    return {
      success: true,
      message: "Installment updated successfully!",
      data: updated,
    };
  },
});

export const deleteInstallment = defineAction({
  accept: 'json',
  input: deleteInstallmentSchema,
  handler: async (input, context) => {
    requireAdmin(context);
    const db = getDb(env);

    const deletedInstallment = await installmentService.delete(db, input.id);

    return {
      success: true,
      message: "Installment deleted successfully!",
      data: deletedInstallment,
    };
  },
});