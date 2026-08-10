// src/modules/installment/installment-table.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { productTable } from "@/modules/product/product-table";
import { generateUUID } from "@/utils";

export const installmentTable = sqliteTable("installments", {
  id: text("id").primaryKey().$defaultFn(generateUUID),
  productId: text("product_id")
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  amountPaid: integer("amount_paid").notNull(),
  paidAt: integer("paid_at").notNull().$defaultFn(generateUnixTimestamp),

  // Snapshot of the staff member who recorded this payment — same pattern
  // as product/customer createdByName, kept as plain text rather than an
  // FK so the record survives staff account deletion.
  createdByName: text("created_by_name").notNull(),
  createdAt: integer("created_at").notNull().$defaultFn(generateUnixTimestamp),
});