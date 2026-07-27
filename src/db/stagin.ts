import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ----------------------------------------------------------------------
// 1. Users Table (Admin & Staff)
// ----------------------------------------------------------------------
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  idCardNumber: text('id_card_number').notNull().unique(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull().unique(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'staff'] }).notNull().default('staff'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ----------------------------------------------------------------------
// 2. Orders Table (Product & Installment Details)
// ----------------------------------------------------------------------
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  serialNumber: text('serial_number').notNull().unique(),
  customerPhoneNumber: text('customer_phone_number').notNull(),
  productName: text('product_name').notNull(),
  totalAmount: real('total_amount').notNull(),
  downpayment: real('downpayment').notNull(),
  remainingBalance: real('remaining_balance').notNull(),
  createdBy: text('created_by')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ----------------------------------------------------------------------
// 3. Installment Payments Table (Subsequent Payments)
// ----------------------------------------------------------------------
export const installmentPayments = sqliteTable('installment_payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  amountPaid: real('amount_paid').notNull(),
  collectedBy: text('collected_by')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// ----------------------------------------------------------------------
// Relationships (For Easy Drizzle Queries)
// ----------------------------------------------------------------------
export const ordersRelations = relations(orders, ({ one, many }) => ({
  creator: one(users, {
    fields: [orders.createdBy],
    references: [users.id],
  }),
  payments: many(installmentPayments),
}));

export const installmentPaymentsRelations = relations(
  installmentPayments,
  ({ one }) => ({
    order: one(orders, {
      fields: [installmentPayments.orderId],
      references: [orders.id],
    }),
    collector: one(users, {
      fields: [installmentPayments.collectedBy],
      references: [users.id],
    }),
  })
);