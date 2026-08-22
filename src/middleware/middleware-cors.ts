import type { MiddlewareHandler } from "astro";

export const corsMiddleware: MiddlewareHandler = async (_, next) => {
  const response = await next();

  // Allow all origins (development only)
  response.headers.set("Access-Control-Allow-Origin", "*");

  // Allowed methods
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // Allowed headers
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
};