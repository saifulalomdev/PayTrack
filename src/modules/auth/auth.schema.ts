import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().min(1, "মোবাইল নম্বর লিখুন।"),
  password: z.string().min(1, "পাসওয়ার্ড লিখুন।"),
});

export type LoginInput = z.infer<typeof loginSchema>;