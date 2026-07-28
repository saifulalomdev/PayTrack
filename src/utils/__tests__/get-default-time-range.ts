import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDefaultTimeRange } from "../get-default-time-range";

describe("getDefaultTimeRange", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return a 12-hour rolling date range ending at current time", () => {
    const mockNow = new Date("2026-05-25T12:00:00.000Z");
    vi.setSystemTime(mockNow);

    const result = getDefaultTimeRange();

    expect(result).toEqual({
      from: new Date("2026-05-25T00:00:00.000Z"), // 12 hours earlier
      to: mockNow,
    });
  });

  it("should ensure both from and to are valid Date objects", () => {
    vi.setSystemTime(new Date("2026-01-01T10:00:00.000Z"));

    const result = getDefaultTimeRange();

    expect(result.from).toBeInstanceOf(Date);
    expect(result.to).toBeInstanceOf(Date);
  });

  it("should always return to as current system time", () => {
    const now = new Date("2026-08-10T15:30:00.000Z");
    vi.setSystemTime(now);

    const result = getDefaultTimeRange();

    expect(result?.to?.getTime()).toBe(now.getTime());
  });

  it("should always have from less than to", () => {
    vi.setSystemTime(new Date("2026-05-25T12:00:00.000Z"));

    const result = getDefaultTimeRange();

    if (!result.from || !result.to) return;

    expect(result.from.getTime()).toBeLessThan(result.to.getTime());
  });
});