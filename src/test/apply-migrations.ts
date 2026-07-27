// src/test/apply-migrations.ts
// @ts-ignore
import { applyD1Migrations, env } from "cloudflare:test";

// Runs once before any test file in this Vitest "project" starts.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);