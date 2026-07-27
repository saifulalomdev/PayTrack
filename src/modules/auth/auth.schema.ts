import { z } from 'astro:schema';

// Single Source of Truth for Constants
export const AUTH_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
} as const;

// Single Source of Truth for Validation Messages
export const AUTH_MESSAGES = {
  EMAIL_INVALID: "Please enter a valid business email address.",
  PASSWORD_TOO_SHORT: `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long.`,
  PASSWORD_TOO_LONG: `Password cannot exceed ${AUTH_CONFIG.PASSWORD_MAX_LENGTH} characters.`,
} as const;

// User-Friendly Schema Configuration
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: AUTH_MESSAGES.EMAIL_INVALID }),
    
  password: z
    .string()
    .min(AUTH_CONFIG.PASSWORD_MIN_LENGTH, { message: AUTH_MESSAGES.PASSWORD_TOO_SHORT })
    .max(AUTH_CONFIG.PASSWORD_MAX_LENGTH, { message: AUTH_MESSAGES.PASSWORD_TOO_LONG }),
});

export type LoginInput = z.infer<typeof loginSchema>;