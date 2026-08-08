import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "মোবাইল নম্বর খালি রাখা যাবে না।" })
    .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, {
      message: "সঠিক বাংলাদেশী মোবাইল নম্বর দিন (উদাঃ 01XXXXXXXXX)।",
    }),

  password: z
    .string()
    .min(1, { message: "পাসওয়ার্ড খালি রাখা যাবে না।" })
    .min(6, { message: "পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে।" })
    .max(32, { message: "পাসওয়ার্ডটি ৩২ অক্ষরের বেশি হতে পারবে না।" }),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
