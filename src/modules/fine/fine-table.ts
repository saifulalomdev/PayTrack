// src/modules/fine/fine-table.ts
import { productTable } from "@/db";
import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const fineTable = sqliteTable('fines', {
  id: text('id').primaryKey()
    .$defaultFn(generateUUID),

  productId: text('product_id')
    .notNull()
    .references(() => productTable.id, { onDelete: "cascade" }),
  // Whole-currency-unit integer, matching the existing money-field convention.
  amount: integer('amount').notNull(),

  note: text('note').notNull(),

  // Snapshot of the staff name who added this fine — intentionally NOT a
  // foreign key to staffTable, so this value survives even if the staff
  // member is later deleted. Injected server-side from the authenticated
  // staff's session, never trusted from client input.
  createdByName: text('created_by_name').notNull(),

  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});