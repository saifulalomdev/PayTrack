// src/modules/fine/fine.service.ts
import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";
import { fineRepository } from "./fine-repository";
import type { InsertFine, UpdateFine, SelectFine, PublicFine } from "./fine-types";

function toSafeFine(row: SelectFine): PublicFine {
    // No sensitive field on fine — pass-through.
    return row;
}

export const fineService = {
    async createFine(
        db: D1Instance,
        input: InsertFine,
        productId: string,
        createdByName: string,
    ): Promise<PublicFine> {
        const newFine = await fineRepository.create(db, { ...input, productId, createdByName });
        return toSafeFine(newFine);
    },

    // Admin-only, enforced at the action layer via requireAdmin.
    async updateFine(db: D1Instance, id: string, input: UpdateFine): Promise<PublicFine> {
        const existing = await fineRepository.findById(db, id);
        if (!existing) {
            throw new ActionError({ code: "NOT_FOUND", message: "জরিমানা পাওয়া যায়নি।" });
        }

        const updated = await fineRepository.update(db, id, input);
        return toSafeFine(updated);
    },

    // Admin-only, enforced at the action layer via requireAdmin.
    async deleteFine(db: D1Instance, id: string): Promise<PublicFine> {
        const existing = await fineRepository.findById(db, id);
        if (!existing) {
            throw new ActionError({ code: "NOT_FOUND", message: "জরিমানা পাওয়া যায়নি।" });
        }

        const deleted = await fineRepository.delete(db, id);
        return toSafeFine(deleted);
    },

    async listAll(db: D1Instance): Promise<PublicFine[]> {
        const rows = await fineRepository.findAll(db);
        return rows.map(toSafeFine);
    },

    async getById(db: D1Instance, id: string): Promise<PublicFine | null> {
        const row = await fineRepository.findById(db, id);
        return row ? toSafeFine(row) : null;
    },

    async listByProductId(db: D1Instance, productId: string): Promise<PublicFine[]> {
        const rows = await fineRepository.findByProductId(db, productId);
        return rows.map(toSafeFine);
    },
};