/**
 * Resolves the base URL of the application depending on the runtime environment.
 * * In a browser environment (client-side), it dynamically extracts the current origin 
 * using `window.location.origin`. In non-browser environments (server-side, SSR, or edge workers), 
 * it falls back to a provided configuration string or local development host.
 *
 * @param {string} [fallback="https://localhost:3000"] - The backup URL to use when executing server-side.
 * @returns {string} The resolved base URL (protocol + domain + port).
 * * @example
 * // Client-side running on https://myapp.com/dashboard
 * getBaseUrl() // => "https://myapp.com"
 * * @example
 * // Server-side / SSR rendering context
 * getBaseUrl("https://api.production.com") // => "https://api.production.com"
 */
export function getBaseUrl(fallback: string = "https://localhost:3000"): string {
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  return fallback;
}