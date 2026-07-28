import { hashPassword } from "@/utils/password";
import { eq } from "drizzle-orm";
import { getDb } from "./get-db";
import { staffTable } from "@/db";

export async function initializeSuperAdmin(env: Env) {
   const db =  getDb(env)
  const adminUser = env.SUPER_ADMIN_USER;
  const adminPass = env.SUPER_ADMIN_PASS;

  // Safety check: Make sure env variables exist
  if (!adminUser || !adminPass) return;

  // 1. Check if super admin already exists in the database
  const existingAdmin = await db
    .select()
    .from(staffTable)
    .where(eq(staffTable.phoneNumber, adminUser))
    .get();

  // 2. If super admin does NOT exist, create it with hashed password
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPass);

    await db.insert(staffTable).values({
      username: adminUser,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`✅ Initial Super Admin (${adminUser}) created in database.`);
  }
}