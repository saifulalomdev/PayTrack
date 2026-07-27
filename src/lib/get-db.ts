// src/lib/get-db.ts
import * as schema from "@/db/schema/index";
import { drizzle } from 'drizzle-orm/d1';

/**
 * Initializes and returns a type-safe Drizzle ORM client instance for Cloudflare D1.
 * * This function performs a runtime check to ensure that the Cloudflare D1 database 
 * binding (`env.DB`) is present before establishing the connection, avoiding silent 
 * application failures.
 *
 * @param {Env | undefined} env - The Cloudflare environment object containing context bindings.
 * @returns {import("drizzle-orm/d1").DrizzleD1Database<typeof schema>} An initialized Drizzle client instance.
 * @throws {Error} Throws a `DATABASE_BINDING_MISSING` error if the environment or D1 binding is undefined.
 * * @example
 * const db = getDb(env);
 * await db.select().from(event);
 */

export const getDb = (env: Env | undefined) => {
    // Prevent silent failure by checking if Cloudflare's binding exists
    if (!env || !env.DB) {
        throw new Error("DATABASE_BINDING_MISSING: Ensure wrangler.jsonc contains the DB binding and env is passed correctly.");
    }
    return drizzle(env.DB, { schema });
};

// This correctly extracts the exact Drizzle client instance type automatically!
export type D1Instance = ReturnType<typeof getDb>;
