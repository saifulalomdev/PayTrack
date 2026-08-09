// src/modules/installment/installment.service.ts
import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";
import { customerRepository } from "@/modules/customer/customer-repository";
import type { InsertInstallment, NewInstallment, UpdateInstallment, SelectInstallment, PublicInstallment } from "./installment.types";
import { installmentRepository } from "./installment.repository";

function toSafeInstallment(installment: SelectInstallment): PublicInstallment {
    return installment;
}

export const installmentService = {
    /**
     * createdByName must be captured server-side from the authenticated
     * staff's own session (see installment.actions.ts) — never trust a
     * client-supplied value here, for the same reason as
     * customerService.createCustomer.
     */
    async createInstallment(
        db: D1Instance,
        input: InsertInstallment,
        createdByName: string
    ): Promise<PublicInstallment> {
        const customer = await customerRepository.findById(db, input.customerId);
        if (!customer) {
            throw new ActionError({ code: "NOT_FOUND", message: "গ্রাহক পাওয়া যায়নি।" });
        }

        const newInstallmentData: NewInstallment = { ...input, createdByName };
        const newInstallment = await installmentRepository.create(db, newInstallmentData);
        return toSafeInstallment(newInstallment);
    },

    /**
     * Admin only — role check is enforced in the action layer
     * (requireAdmin), not here.
     */
    async updateInstallment(db: D1Instance, id: string, input: UpdateInstallment): Promise<PublicInstallment> {
        const { id: _ignoredId, ...updatePayload } = input;

        const existingInstallment = await installmentRepository.findById(db, id);
        if (!existingInstallment) {
            throw new ActionError({ code: "NOT_FOUND", message: "কিস্তির তথ্য পাওয়া যায়নি।" });
        }

        const updated = await installmentRepository.update(db, id, updatePayload);
        return toSafeInstallment(updated);
    },

    /**
     * Admin only — role check is enforced in the action layer
     * (requireAdmin), not here.
     */
    async deleteInstallment(db: D1Instance, id: string): Promise<PublicInstallment> {
        const existingInstallment = await installmentRepository.findById(db, id);
        if (!existingInstallment) {
            throw new ActionError({ code: "NOT_FOUND", message: "কিস্তির তথ্য পাওয়া যায়নি।" });
        }

        const deleted = await installmentRepository.delete(db, id);
        return toSafeInstallment(deleted);
    },

    async listByCustomer(db: D1Instance, customerId: string): Promise<PublicInstallment[]> {
        const installments = await installmentRepository.findByCustomerId(db, customerId);
        return installments.map(toSafeInstallment);
    },

    async listAll(db: D1Instance): Promise<PublicInstallment[]> {
        const installments = await installmentRepository.findAll(db);
        return installments.map(toSafeInstallment);
    },

    async getById(db: D1Instance, id: string): Promise<PublicInstallment | null> {
        const installment = await installmentRepository.findById(db, id);
        return installment ? toSafeInstallment(installment) : null;
    },
};