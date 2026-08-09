import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getBaseUrl } from "../get-base-url"; // Update with your actual import path

describe("getBaseUrl() Environment Evaluator", () => {
  // Store the original window object before each test runs
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset global environment state
    vi.stubGlobal("window", undefined);
  });

  afterEach(() => {
    // Restore the pristine global state after each test finishes
    if (originalWindow) {
      global.window = originalWindow;
    } else {
      vi.unstubAllGlobals();
    }
  });

  it("should return the custom fallback URL when executing on the server side (Node/Edge)", () => {
    // window is undefined by default in our beforeEach hook
    const result = getBaseUrl("https://my-production-app.com");
    expect(result).toBe("https://my-production-app.com");
  });

  it("should return localhost:3000 if no parameters are supplied on the server side", () => {
    const result = getBaseUrl();
    expect(result).toBe("https://localhost:3000");
  });

  it("should return the current browser origin when executing inside a browser environment", () => {
    // Mock the window object environment safely
    vi.stubGlobal("window", {
      location: {
        origin: "https://saifulalom.com",
      },
    });

    const result = getBaseUrl("https://fallback-url.com");
    
    // It should ignore the fallback entirely and fetch from the location API
    expect(result).toBe("https://saifulalom.com");
  });
});
