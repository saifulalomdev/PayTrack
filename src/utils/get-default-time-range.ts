import { subHours, subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";

/**
 * Generates the fallback date range boundary targets for dashboard analytics metrics queries.
 * By default, this establishes a trailing 12 hours window ending at the current time.
 *
 * @returns {DateRange} An object containing the absolute `from` (12 hour ago) and `to` (now) JavaScript Date bounds.
 *
 * @example
 * const defaultRange = getDefaultTimeRange();
 * // Returns: { from: Mon Apr 25 2026 ..., to: Mon May 25 2026 ... }
 */
export function getDefaultTimeRange(): DateRange {
    const today = new Date();
    return {
        from: subHours(today, 12), 
        to: today
    };
}