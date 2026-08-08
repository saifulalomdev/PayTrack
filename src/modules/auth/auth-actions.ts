import { buildSessionCookieValue } from "@/utils/auth";
import { defineAction } from "astro:actions";
import { authService } from "./auth-service";
import { loginSchema } from "./auth-schema";
import { env } from "cloudflare:workers";
import { getDb } from "@/utils";

/**
 * Name of the authentication session cookie.
 */
const SESSION_COOKIE_NAME = "staff_session";

/**
 * Security configuration for the session cookie.
 * Valid for 7 days.
 */
const SESSION_COOKIE_OPTIONS = {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
};

/**
 * Astro Action: Log in a staff member and set their session cookie.
 */
export const login = defineAction({
    accept: "json",
    input: loginSchema,
    handler: async (input, context) => {

        // 1. Connect to the D1 database
        const db = getDb(env);

        // 2. Validate staff credentials using the service layer
        const user = await authService.login(db, input);

        // 3. Create the encrypted cookie string
        const sessionValue = buildSessionCookieValue(user);

        // 4. Save the cookie in the browser
        context.cookies.set(SESSION_COOKIE_NAME, sessionValue, SESSION_COOKIE_OPTIONS);

        // 5. Return success result to the client
        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                phoneNumber: user.phoneNumber,
            },
        };
    },
});

/**
 * Astro Action: Log out a staff member by deleting their session cookie.
 */
export const logout = defineAction({
    accept: "json",
    handler: async (_, context) => {
        
        // 1. Check if the user currently has an active session cookie
        const hasSession = context.cookies.has(SESSION_COOKIE_NAME);

        // 2. Remove the session cookie from the browser
        context.cookies.delete(SESSION_COOKIE_NAME, {
            path: "/",
        });

        // 3. Return success status
        return {
            success: true,
            message: hasSession 
                ? "Logged out successfully." 
                : "No active session was found.",
        };
    },
});