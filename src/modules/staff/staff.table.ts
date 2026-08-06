// src/modules/staff/staff.table.ts
import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const staffTable = sqliteTable('staffTable', {
  id: text('id').primaryKey()
    .$defaultFn(generateUUID),
  name: text('name').notNull(),
  password: text('password').notNull(),
  phoneNumber: text('phone_number').notNull().unique(),
  role: text('role', { enum: ['admin', 'staff'] }).notNull().default('staff'),
  tokenVersion: integer('token_version').notNull().default(0),
  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});