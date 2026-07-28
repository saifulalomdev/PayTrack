import bcrypt from "bcryptjs";

// 1. Hash Password
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// 2. Verify Password
export async function verifyPassword(
  hash: string, 
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}