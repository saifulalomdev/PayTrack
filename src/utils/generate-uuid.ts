/**
 * Generates a cryptographically secure, random version 4 Universally Unique Identifier (UUID).
 * * This function leverages the native Web Crypto API (`crypto.randomUUID()`), which is highly 
 * performant and supported across modern browsers, Node.js, and edge environments like Cloudflare Workers.
 *
 * @returns {string} A canonical 36-character v4 UUID string (e.g., "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed").
 * * @example
 * const userId = generateUUID();
 * console.log(userId); // => "f81d4fae-7dec-11d0-a765-00a0c91e6bf6"
 */
export const generateUUID = (): string => crypto.randomUUID();