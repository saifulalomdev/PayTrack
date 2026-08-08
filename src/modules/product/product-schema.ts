import { createSelectSchema, createInsertSchema } from 'drizzle-orm/zod';
import { productTable } from './product-table';
import { z } from 'zod';

export const selectProductSchema = createSelectSchema(productTable).strict();

export const insertProductSchema = createInsertSchema(productTable, {
  id: (s) => s.optional(),
  createdAt: (s) => s.optional(),

  // Enforce customer relational requirement
  customerId: z.string(),

  // String field validations
  productName: (s) => s
    .min(2, { message: "পণ্যের নাম কমপক্ষে ২ অক্ষরের হতে হবে।" })
    .max(100, { message: "পণ্যের নাম ১০০ অক্ষরের বেশি হতে পারবে না।" }),

  createdByName: (s) => s.createdByName
    .min(2, { message: "তৈরি কারকের নাম কমপক্ষে ২ অক্ষরের হতে হবে।" }),

  // Financial numeric validations (Using explicit Zod primitives for runtime number validation)
  totalPrice: z.number({
    required_error: "মোট মূল্য দিতে হবে।",
    invalid_type_error: "মোট মূল্য অবশ্যই একটি সংখ্যা হতে হবে।",
  }).positive({ message: "মোট মূল্য অবশ্যই ০ থেকে বেশি হতে হবে।" }),

  downPayment: z.number({
    required_error: "ডাউন পেমেন্ট দিতে হবে।",
    invalid_type_error: "ডাউন পেমেন্ট অবশ্যই একটি সংখ্যা হতে হবে।",
  }).min(0, { message: "ডাউন পেমেন্ট ০ বা তার বেশি হতে হবে।" }),

  installmentAmount: z.number({
    required_error: "কিস্তির পরিমাণ দিতে হবে।",
    invalid_type_error: "কিস্তির পরিমাণ অবশ্যই একটি সংখ্যা হতে হবে।",
  }).positive({ message: "কিস্তির পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে।" }),

  // Deadline tracking validation
  installmentDeadline: z.number().positive({ message: "সঠিক কিস্তির সময়সীমা উল্লেখ করুন।" }),

}).strict();

// 3. Update Schema (Inherits all Bangla messages dynamically)
export const updateProductSchema = insertProductSchema.partial();
