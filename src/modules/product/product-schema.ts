import { createSelectSchema, createInsertSchema } from 'drizzle-orm/zod';
import { productTable } from './product-table';
import { z } from 'zod';

export const selectProductSchema = createSelectSchema(productTable).strict();

export const insertProductSchema = createInsertSchema(productTable, {
  id: (s) => s.optional(),
  createdAt: (s) => s.optional(),
  createdByName: (s) => s.optional(),

  customerId: z.string(),

  productName: (s) => s
    .min(2, { message: "Product name must be at least 2 characters." })
    .max(100, { message: "Product name cannot exceed 100 characters." }),

  totalPrice: z.number().positive({ message: "Total price must be greater than 0." }),
  downPayment: z.number().min(0, { message: "Down payment must be 0 or greater." }),
  installmentAmount: z.number().positive({ message: "Installment amount must be greater than 0." }),
  installmentDeadline: z.number().positive({ message: "Please provide a valid deadline." }),
}).strict().omit({ id: true });

export const updateProductSchema = insertProductSchema.extend({
  id: z.string(),
}).strict();

export const deleteProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
});