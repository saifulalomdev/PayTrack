import { getDb } from "./get-db";
import { hashPassword, verifyPassword } from "./password";
import { staffTable } from "@/modules/staff/staff-table";
import { eq } from "drizzle-orm";

export const registerAdmin = async (env: Env) => {
  const db = getDb(env);

  // 1. Find existing admin user directly from DB table
  const [existingAdmin] = await db
    .select()
    .from(staffTable)
    .where(eq(staffTable.role, "admin"))
    .limit(1);

  const hashedPassword = await hashPassword(env.SUPER_ADMIN_PASS);

  if (!existingAdmin) {
    // Create super admin if none exists
    await db.insert(staffTable).values({
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

  // If there are changes, update database and bump tokenVersion to invalidate old sessions
  if (Object.keys(updateData).length > 0) {
    updateData.tokenVersion = (existingAdmin.tokenVersion ?? 0) + 1;

    await db
      .update(staffTable)
      .set(updateData)
      .where(eq(staffTable.id, existingAdmin.id));

    return { success: true, message: "Super Admin credentials updated" };
  }

  return { success: true, message: "Super Admin already up to date" };
};