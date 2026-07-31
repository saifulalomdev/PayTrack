// src/modules/installment/installment.table.ts
import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { customerTable } from "@/modules/customer/customer.table";

export const installmentTable = sqliteTable('installmentTable', {
  id: text('id').primaryKey().$defaultFn(generateUUID),

  // Unlike created_by_name on customerTable, THIS is a real foreign key
  // (not a text snapshot) — an installment only exists in the context of
  // a specific customer, so if the customer is deleted (admin-only
  // action), its installment history should go with it. onDelete:
  // 'cascade' enforces that at the DB level instead of leaving orphans.
  customerId: text('customer_id')
    .notNull()
    .references(() => customerTable.id, { onDelete: 'cascade' }),

  // Whole-taka integer, same convention as the money fields on customerTable.
  amount: integer('amount').notNull(),

  // Unix timestamp of when this installment was actually paid.
  paidAt: integer('paid_at').notNull(),

  note: text('note'),

  // Snapshot of the staff member who recorded this payment — plain text,
  // NOT a foreign key to staffTable, for the same reason as
  // customerTable.createdByName: staff accounts can be deleted, but the
  // record of who logged the payment should persist.
  createdByName: text('created_by_name').notNull(),

  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});