// src/modules/customer/customer.table.ts
import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customerTable = sqliteTable('customerTable', {
  id: text('id').primaryKey().$defaultFn(generateUUID),

  // Manually entered from the dashboard form when a customer is created —
  // NOT auto-generated. Must stay unique so a serial number always maps to
  // exactly one customer/installment record.
  serialNumber: text('serial_number').notNull().unique(),

  name: text('name').notNull(),
  
  // Snapshot of the creating staff member's name — plain text, NOT a
  // foreign key to staffTable. Staff accounts can be deleted later; we
  // still want a permanent record of who originally added this customer,
  // so the name is copied in at creation time instead of referenced by id.
  createdByName: text('created_by_name').notNull(),

  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});