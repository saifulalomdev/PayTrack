import { describe, it, expect } from "vitest";
import { generateUUID } from "../generate-uuid";

describe("generateUUID()", () => {
  it("should return a valid string", () => {
    const uuid = generateUUID();
    expect(uuid).toBeTypeOf("string");
  });

  it("should return a value that conforms to the UUID v4 format pattern", () => {
    const uuid = generateUUID();
    
    // Regular expression to validate standard UUID v4 structure
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    expect(uuid).toMatch(uuidV4Regex);
  });

  it("should generate completely unique values on consecutive calls", () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    
    expect(uuid1).not.toBe(uuid2);
  });
});
