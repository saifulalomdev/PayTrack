import type { MiddlewareHandler } from "astro";
import { defineMiddleware } from "astro:middleware";

export const logger: MiddlewareHandler = async (context, next) => {
    console.log("Request received for:", context.url.pathname);
    
    // You MUST call next() and return its response
    const response = await next();
    
    return response;
}