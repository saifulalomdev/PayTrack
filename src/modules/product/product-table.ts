import { generateUUID } from "@/utils";
import { generateUnixTimestamp } from "@/utils/generate-timestamp";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { customerTable } from "@/modules/customer/customer.table";

export const productTable = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(generateUUID),

  customerId: text("customer_id")
    .notNull()
    .references(() => customerTable.id, { onDelete: "cascade" }),

  productName: text("product_name").notNull(),

  totalPrice: integer("total_price").notNull(),
  downPayment: integer("down_payment").notNull(),
  installmentAmount: integer("installment_amount").notNull(),
  installmentDeadline: integer("installment_deadline").notNull(),

  createdByName: text("created_by_name").notNull(),
  createdAt: integer("created_at").notNull().$defaultFn(generateUnixTimestamp),
});