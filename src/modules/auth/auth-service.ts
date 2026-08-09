import { staffRepository } from "../staff/staff-repository";
import { verifyPassword } from "@/utils/password";
import type { LoginInput } from "./auth-type";
import { ActionError } from "astro:actions";
import type { D1Instance } from "@/utils";

export const authService = {
    /**
     * Authenticates a staff user using their phone number and password.
     *
     * @param {D1Instance} db - The database instance.
     * @param {LoginInput} input - Contains `phoneNumber` and `password`.
     * @returns {Promise<Staff>} The authenticated staff object if successful.
     * @throws {ActionError} Throws UNAUTHORIZED error if the phone number is not found or password does not match.
     */
    login: async (db: D1Instance, input: LoginInput) => {
        const { phoneNumber, password } = input;

        // 1. Fetch staff record by phone number
        const staff = await staffRepository.findByPhoneNumber(db, phoneNumber);
        if (!staff) {
            // Keep error messages generic to prevent user enumeration attacks
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
            });
        }

        // 2. Validate the provided password against the hashed password
        const isValidPassword = await verifyPassword(password, staff.password);
        if (!isValidPassword) {
            throw new ActionError({
                code: "UNAUTHORIZED",
                message: "মোবাইল নম্বর অথবা পাসওয়ার্ড ভুল হয়েছে।",
            });
        }

        // 3. Return the authenticated staff record
        return staff;
    }
};