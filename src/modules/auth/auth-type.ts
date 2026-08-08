import type { loginSchema } from "./auth-schema";
import type z from "zod";

export type LoginInput = z.infer<typeof loginSchema>;
