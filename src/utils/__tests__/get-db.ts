import { describe, it, expect } from "vitest";
import { env } from 'cloudflare:workers';
import { getDb } from "../get-db";

describe("getDb() Utility Bootstrapper", () => {
  it("should successfully initialize Drizzle when given a valid D1 binding", () => {
    // Act
    const dbInstance = getDb(env);

    // Assert: Verify it returns a valid Drizzle instance by checking its core methods
    expect(dbInstance).toBeDefined();
    expect(dbInstance.select).toBeTypeOf("function");
  });

  it("should throw a specific operational error if the env parameter is completely missing", () => {
    // Act & Assert: Expect the function execution block to throw immediately
    expect(() => getDb(undefined)).toThrowError(
      "DATABASE_BINDING_MISSING: Ensure wrangler.jsonc contains the DB binding and env is passed correctly."
    );
  });

  it("should throw an operational error if env exists but the DB property is undefined", () => {
    // Arrange: Simulate a scenario where other variables are bound but DB is missing
    const invalidEnv = { SOME_OTHER_SECRET: "12345" } as any;

    // Act & Assert
    expect(() => getDb(invalidEnv)).toThrowError(
      "DATABASE_BINDING_MISSING: Ensure wrangler.jsonc contains the DB binding and env is passed correctly."
    );
  });
});