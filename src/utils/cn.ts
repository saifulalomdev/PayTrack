import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple Tailwind CSS class names or conditional expressions 
 * and safely merges conflicting utilities.
 * * This utility uses `clsx` to parse conditional classes, arrays, objects, 
 * or strings, and then passes them to `twMerge` to ensure the final 
 * Tailwind classes don't conflict (e.g., resolving `p-2 p-4` to just `p-4`).
 *
 * @param {...ClassValue[]} inputs - An array of class expressions, strings, objects, or arrays.
 * @returns {string} A single, optimized string of merged Tailwind CSS class names.
 * * @example
 * // Standard usage
 * cn("bg-red-500", "text-center") // => "bg-red-500 text-center"
 * * @example
 * // Conditional usage
 * cn("p-4", isTrue && "bg-blue-500", !isTrue && "bg-red-500")
 * * @example
 * // Merging conflicting Tailwind classes
 * cn("px-2 py-1", "p-4") // => "p-4" (twMerge resolves the conflict)
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}