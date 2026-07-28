import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const staffTable = sqliteTable('staffTable', {
  id: text('id').primaryKey().$defaultFn(generateUUID),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'staff'] }).notNull().default('staff'),
  createdAt: integer('created_at').notNull().$defaultFn(generateUnixTimestamp),
});