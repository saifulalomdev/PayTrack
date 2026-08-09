import { staffRepository } from "@/modules/staff/staff-repository";
import { hashPassword, verifyPassword } from "./password";
import { getDb } from "./get-db";

export const registerAdmin = async (env: Env) => {
    const db = getDb(env);

    // 1. Find super admin by role (or find existing admin account)
    const existingAdmin = await staffRepository.findByRole(db, "admin");

    const hashedPassword = await hashPassword(env.SUPER_ADMIN_PASS);

    if (!existingAdmin) {
        // Create if no admin exists yet
        await staffRepository.create(db, {
            name: "Zilal Ahmed",
            phoneNumber: env.SUPER_ADMIN_PHONE,
            password: hashedPassword,
            role: "admin",
        });
        return { success: true, message: "Super Admin created" };
    }

    // 2. Check if phone number or password changed
    const isPhoneChanged = existingAdmin.phoneNumber !== env.SUPER_ADMIN_PHONE;
    const isPasswordSame = await verifyPassword(
        env.SUPER_ADMIN_PASS,
        existingAdmin.password
    );

    // 3. Update payload dynamically
    const updateData: Record<string, any> = {};

    if (isPhoneChanged) {
        updateData.phoneNumber = env.SUPER_ADMIN_PHONE;
    }

    if (!isPasswordSame) {
        updateData.password = hashedPassword;
    }

    // If there are changes, update database
    if (Object.keys(updateData).length > 0) {
        await staffRepository.update(db, existingAdmin.id, updateData);
        return { success: true, message: "Super Admin credentials updated" };
    }

    return { success: true, message: "Super Admin already up to date" };
};