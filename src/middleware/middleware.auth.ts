import type { MiddlewareHandler } from "astro";
import { env } from "cloudflare:workers";
import { jwtVerify } from "jose";

export const authMiddleware: MiddlewareHandler = async (context, next) => {
  const { url, cookies, locals, redirect } = context;

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isLogin = url.pathname.startsWith("/login");
  
  // Get the token if it exists
  const token = cookies.get("auth_token")?.value;

  // 1. Check if token is valid
  let isLoggedIn = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET);
      await jwtVerify(token, secret);
      isLoggedIn = true;
    } catch (error) {
      // Token is bad/expired, clear it
      cookies.delete("auth_token", { path: "/" });
    }
  }

  // 2. Enforce Access Rules
  
  // If trying to access dashboard but NOT logged in -> Go to Login
  if (isDashboard && !isLoggedIn) {
    return redirect("/login");
  }

  // If trying to access login but ALREADY logged in -> Go to Dashboard
  if (isLogin && isLoggedIn) {
    return redirect("/dashboard");
  }

  return next();
};