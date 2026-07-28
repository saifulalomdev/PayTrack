import { format } from "date-fns";
/**
 * Formats a JavaScript Date object into a readable, standardized string token layout.
 * * This function applies the token format `dd LLL,  yyyy` to present dates with 
 * zero-padded days, standalone short month names, and full calendar years.
 *
 * @param {Date} date - The JavaScript Date object to transform.
 * @returns {string} The localized, formatted date string.
 * * @example
 * // If the input date is May 25, 2026
 * formatDate(new Date(2026, 4, 25)) // => "25 May,  2026"
 * * @example
 * // If the input date is January 05, 2026
 * formatDate(new Date(2026, 0, 5))  // => "05 Jan,  2026"
 */
export function formatDate(date: Date) {
    const dateFormate = "dd LLL,  yyyy";
    return format(date, dateFormate)
}