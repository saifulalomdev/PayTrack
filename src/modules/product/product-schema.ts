import { createSelectSchema, createInsertSchema } from 'drizzle-orm/zod';
import { productTable } from './product-table';
import { z } from 'zod';

export const selectProductSchema = createSelectSchema(productTable).strict();

export const insertProductSchema = createInsertSchema(productTable, {
  id: (s) => s.optional(),
  createdAt: (s) => s.optional(),
  createdByName: (s) => s.optional(), // Make optional so UI doesn't require it

  customerId: z.string(),

  productName: (s) => s
    .min(2, { message: "পণ্যের নাম কমপক্ষে ২ অক্ষরের হতে হবে।" })
    .max(100, { message: "পণ্যের নাম ১০০ অক্ষরের বেশি হতে পারবে না।" }),

  totalPrice: z.number().positive({ message: "মোট মূল্য অবশ্যই ০ থেকে বেশি হতে হবে।" }),
  downPayment: z.number().min(0, { message: "ডাউন পেমেন্ট ০ বা তার বেশি হতে হবে।" }),
  installmentAmount: z.number().positive({ message: "কিস্তির পরিমাণ অবশ্যই ০ থেকে বেশি হতে হবে।" }),
  installmentDeadline: z.number().positive({ message: "সঠিক কিস্তির সময়সীমা উল্লেখ করুন।" }),
}).strict();