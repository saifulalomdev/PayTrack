import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";
import { env } from "cloudflare:workers";
import { staffRepository } from "./staff.repository";
import { hashPassword, verifyPassword } from "@/utils/password";
import type { InsertStaff, UpdateStaff, SelectStaff, PublicStaff } from "./staff.types";

function assertNotSuperAdmin(staff: SelectStaff, action: string) {
    if (staff.phoneNumber === env.SUPER_ADMIN_PHONE) {
        throw new ActionError({ code: "FORBIDDEN", message: `Super admin can not be ${action}` });
    }
}

/**
 * Strips the password hash before staff data leaves the service layer.
 * Every method below returns through this — never return a raw
 * repository result directly to the action layer.
 */
function toSafeStaff(staff: SelectStaff): PublicStaff {
    const { password, ...safe } = staff;
    return safe;
}

export const staffService = {
    async createStaff(db: D1Instance, input: InsertStaff): Promise<PublicStaff> {
        const existing = await staffRepository.findByPhoneNumber(db, input.phoneNumber);
        if (existing) {
            throw new ActionError({
                code: "CONFLICT",
                message: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যেই একজন স্টাফ তৈরি করা হয়েছে।",
            });
        }

        const { password } = input;
        if (!password) {
            throw new ActionError({
                code: "BAD_REQUEST",
                message: "নতুন স্টাফের জন্য পাসওয়ার্ড আবশ্যক।",
            });
        }

        const hashedPassword = await hashPassword(password);
        const newStaff = await staffRepository.create(db, { ...input, password: hashedPassword });
        return toSafeStaff(newStaff);
    },

    /**
     * Returns the updated staff (password-safe) plus whether credentials
     * changed. When they did, tokenVersion is bumped, which invalidates
     * every existing session cookie for this staff member on next request
     * (see getAuthenticatedStaff).
     */
    async updateStaff(
        db: D1Instance,
        id: string,
        input: UpdateStaff
    ): Promise<{ staff: PublicStaff; credentialsChanged: boolean }> {
        const { id: _ignoredId, password, phoneNumber, role, ...otherData } = input;

        const existingStaff = await staffRepository.findById(db, id);
        if (!existingStaff) {
            throw new ActionError({ code: "NOT_FOUND", message: "স্টাফ পাওয়া যায়নি।" });
        }

        assertNotSuperAdmin(existingStaff, "updated");

        const updatePayload: Record<string, any> = { ...otherData };
        let credentialsChanged = false;

        if (phoneNumber && phoneNumber !== existingStaff.phoneNumber) {
            const phoneTaken = await staffRepository.findByPhoneNumber(db, phoneNumber);
            if (phoneTaken) {
                throw new ActionError({
                    code: "CONFLICT",
                    message: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যেই একজন স্টাফ তৈরি করা হয়েছে।",
                });
            }
            updatePayload.phoneNumber = phoneNumber;
            credentialsChanged = true;
        }

        if (password) {
            updatePayload.password = await hashPassword(password);
            credentialsChanged = true;
        }

        if (role) {
            updatePayload.role = role;
        }

        if (credentialsChanged) {
            updatePayload.tokenVersion = existingStaff.tokenVersion + 1;
        }

        const staff = await staffRepository.update(db, id, updatePayload);
        return { staff: toSafeStaff(staff), credentialsChanged };
    },

    async deleteStaff(db: D1Instance, id: string): Promise<PublicStaff> {
        const existingStaff = await staffRepository.findById(db, id);
        if (!existingStaff) {
            throw new ActionError({ code: "NOT_FOUND", message: "স্টাফ পাওয়া যায়নি।" });
        }

        assertNotSuperAdmin(existingStaff, "deleted");

        const deleted = await staffRepository.delete(db, id);
        return toSafeStaff(deleted);
    },

    // login() intentionally still returns full SelectStaff (with password
    // hash) — this stays server-side only. The action layer never forwards
    // the raw `staff` object; it manually picks { id, name, role } for the
    // response and uses the full object only to build the session cookie.
    async login(db: D1Instance, phoneNumber: string, password: string): Promise<SelectStaff> {
        const staff = await staffRepository.findByPhoneNumber(db, phoneNumber);
        if (!staff) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
            });
        }

        const isValidPassword = await verifyPassword(password, staff.password);
        if (!isValidPassword) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
            });
        }

        return staff;
    },
    async listAll(db: D1Instance): Promise<PublicStaff[]> {
        const staff = await staffRepository.findAll(db);
        return staff.map(toSafeStaff);
    },
    async getById(db: D1Instance, id: string): Promise<PublicStaff | null> {
        const staff = await staffRepository.findById(db, id);
        return staff ? toSafeStaff(staff) : null;
    },
};