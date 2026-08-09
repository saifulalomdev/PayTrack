// src/utils/generate-timestamp.ts
/**
 * Generates a standard UNIX timestamp integer (milliseconds since epoch).
 * This provides blazing-fast indexes and effortless timezone math on 
 * lightweight database engines like Cloudflare D1 SQLite.
 */
export const generateUnixTimestamp = (): number => Date.now();