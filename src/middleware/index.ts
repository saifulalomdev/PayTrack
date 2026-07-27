import { sequence } from "astro:middleware";
import { corsMiddleware } from "./middleware.cors";
import { authMiddleware } from "./middleware.auth";
import { logger } from "./middleware.logger";

export const onRequest = sequence(
    logger,
    corsMiddleware, 
    authMiddleware,
);