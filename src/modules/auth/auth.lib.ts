// src/modules/auth/auth.lib.ts
import { argon2id, argon2Verify } from 'hash-wasm';

export async function hashPassword(password: string): Promise<string> {
  // Generate a random 16-byte salt using Edge Web Crypto API
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const hash = await argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 2,
    memorySize: 19456,
    hashLength: 32,
    outputType: 'encoded',
  });

  return hash;
}


export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    return await argon2Verify({
      password,
      hash: storedHash,
    });
  } catch {
    return false;
  }
}