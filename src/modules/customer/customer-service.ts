// src/modules/customer/customer-service.ts

import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";
import { customerRepository } from "./customer-repository";
import type { InsertCustomer, UpdateCustomer, SelectCustomer, PublicCustomer } from "./customer-types";

function toSafeCustomer(customer: SelectCustomer): PublicCustomer {
  return customer;
}

export const customerService = {
  async createCustomer(
    db: D1Instance,
    input: InsertCustomer,
    createdByName: string
  ): Promise<PublicCustomer> {
    const existing = await customerRepository.findBySerialNumber(db, input.serialNumber);
    if (existing) {
      throw new ActionError({
        code: "CONFLICT",
        message: "এই সিরিয়াল নম্বর দিয়ে ইতিমধ্যেই একজন গ্রাহক তৈরি করা হয়েছে।",
      });
    }

    const newCustomer = await customerRepository.create(db, { ...input, createdByName });
    return toSafeCustomer(newCustomer);
  },

  async updateCustomer(db: D1Instance, id: string, input: UpdateCustomer): Promise<PublicCustomer> {
    const { id: _ignoredId, ...updatePayload } = input;

    const existingCustomer = await customerRepository.findById(db, id);
    if (!existingCustomer) {
      throw new ActionError({ code: "NOT_FOUND", message: "গ্রাহক পাওয়া যায়নি।" });
    }

    if (
      updatePayload.serialNumber &&
      updatePayload.serialNumber !== existingCustomer.serialNumber
    ) {
      const serialTaken = await customerRepository.findBySerialNumber(db, updatePayload.serialNumber);
      if (serialTaken) {
        throw new ActionError({
          code: "CONFLICT",
          message: "এই সিরিয়াল নম্বর দিয়ে ইতিমধ্যেই একজন গ্রাহক তৈরি করা হয়েছে।",
        });
      }
    }

    const customer = await customerRepository.update(db, id, updatePayload);
    return toSafeCustomer(customer);
  },

  async deleteCustomer(db: D1Instance, id: string): Promise<PublicCustomer> {
    const existingCustomer = await customerRepository.findById(db, id);
    if (!existingCustomer) {
      throw new ActionError({ code: "NOT_FOUND", message: "গ্রাহক পাওয়া যায়নি।" });
    }

    const deleted = await customerRepository.delete(db, id);
    return toSafeCustomer(deleted);
  },

  async getById(db: D1Instance, id: string): Promise<PublicCustomer | null> {
    const customer = await customerRepository.findById(db, id);
    return customer ? toSafeCustomer(customer) : null;
  },

  async getAll(db: D1Instance): Promise<PublicCustomer[]> {
    const customers = await customerRepository.findAll(db);
    return customers.map(toSafeCustomer);
  },

  async listAll(
    db: D1Instance,
    params: { search?: string; page?: number; pageSize?: number } = {}
  ): Promise<{
    data: PublicCustomer[];
    pagination: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const page = Math.max(1, Math.floor(params.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? 10)));
    const search = params.search?.trim() || undefined;

    const { data, total } = await customerRepository.list(db, { search, page, pageSize });

    return {
      data: data.map(toSafeCustomer),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  },
};