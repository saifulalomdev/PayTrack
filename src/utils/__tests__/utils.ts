import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn() Style Merger Utility", () => {
  it("should combine multiple static class name strings together", () => {
    const result = cn("text-red-500", "bg-blue-500", "p-4");
    expect(result).toBe("text-red-500 bg-blue-500 p-4");
  });

  it("should evaluate conditional class objects and ignore falsy values", () => {
    const isError = true;
    const isLoading = false;

    const result = cn(
      "border",
      isError && "border-destructive text-red-500",
      isLoading && "opacity-50 pointer-events-none"
    );

    expect(result).toBe("border border-destructive text-red-500");
  });

  it("should successfully resolve and merge overlapping Tailwind utility conflicts", () => {
    // tailwind-merge should recognize that p-4 overrides p-2
    const result = cn("p-2 bg-white", "p-4");
    expect(result).toBe("bg-white p-4");

    // text-blue-500 should override text-red-500
    const textConflict = cn("text-red-500 font-bold", "text-blue-500");
    expect(textConflict).toBe("font-bold text-blue-500");
  });

  it("should handle nested arrays, undefined, and null values without crashing", () => {
    const result = cn([ "flex items-center", null, undefined, ["gap-2", false && "hidden"] ]);
    expect(result).toBe("flex items-center gap-2");
  });
});
