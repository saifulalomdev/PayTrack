// src/modules/customer/customer-table.ts

import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customerTable = sqliteTable('customerTable', {
  id: text('id').primaryKey().$defaultFn(generateUUID),
  serialNumber: text('serial_number').notNull().unique(),
  name: text('name').notNull(),
  guardianName: text('guardian_name'), 
  guardianType: text('guardian_type', { enum: ['father', 'husband'] }),
  phoneNumber: text('phone_number'),
  address: text('address'),
  createdByName: text('created_by_name').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});