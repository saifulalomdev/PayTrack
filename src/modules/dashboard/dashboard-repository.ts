// src/modules/dashboard/dashboard-repository.ts

import { customerTable } from "@/modules/customer/customer-table";
import { installmentTable } from "@/modules/installment/installment-table";
import { productTable } from "@/modules/product/product-table";
import { sql, sum, count, desc, eq, countDistinct } from "drizzle-orm";
import type { D1Instance } from "@/utils";

/**
 * Repository: Pure database operations only.
 * No business logic. Returns raw aggregated data.
 */
export const dashboardRepository = {
  /**
   * Get raw data for today's collections
   * Returns: sum of amountPaid where paidAt is today
   */
  async getTodayCollectedRaw(db: D1Instance): Promise<number> {
    const localDateStr = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Dhaka",
    });

    // Keep this in MILLISECONDS (do not divide by 1000)
    const todayStartUnix = new Date(`${localDateStr}T00:00:00+06:00`).getTime();
    const tomorrowStartUnix = todayStartUnix + 86400 * 1000;

    const result = await db
      .select({ total: sum(installmentTable.amountPaid) })
      .from(installmentTable)
      .where(
        sql`${installmentTable.paidAt} >= ${todayStartUnix} AND ${installmentTable.paidAt} < ${tomorrowStartUnix}`
      );

    return Number(result[0]?.total ?? 0);
  },

  /**
   * Get raw total investment remaining
   * Calculates remaining amount directly inside database engine
   */
  async getTotalInvestmentRemainingRaw(db: D1Instance): Promise<number> {
    const paidSubquery = db
      .select({
        productId: installmentTable.productId,
        totalPaid: sum(installmentTable.amountPaid).as("total_paid"),
      })
      .from(installmentTable)
      .groupBy(installmentTable.productId)
      .as("paid_sums");

    const result = await db
      .select({
        totalRemaining: sql<number>`
          SUM(
            CASE 
              WHEN (${productTable.totalPrice} - ${productTable.downPayment} - COALESCE(${paidSubquery.totalPaid}, 0)) > 0 
              THEN (${productTable.totalPrice} - ${productTable.downPayment} - COALESCE(${paidSubquery.totalPaid}, 0)) 
              ELSE 0 
            END
          )
        `,
      })
      .from(productTable)
      .leftJoin(paidSubquery, eq(productTable.id, paidSubquery.productId));

    return Number(result[0]?.totalRemaining ?? 0);
  },

  /**
   * Get raw total customers count
   */
  async getTotalCustomersRaw(db: D1Instance): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(customerTable);

    return result[0]?.count ?? 0;
  },

  /**
   * Get daily collected totals with pagination
   */
  async getDailyCollectionsRaw(
    db: D1Instance,
    limit: number = 10,
    offset: number = 0
  ) {
    const dateFormatted = sql<string>`strftime('%Y-%m-%d', ${installmentTable.paidAt} / 1000, 'unixepoch', '+06:00')`;

    const result = await db
      .select({
        date: dateFormatted,
        totalCollected: sum(installmentTable.amountPaid),
      })
      .from(installmentTable)
      .groupBy(dateFormatted)
      .orderBy(desc(dateFormatted))
      .limit(limit)
      .offset(offset);

    return result.map((row) => ({
      date: row.date,
      totalCollected: Number(row.totalCollected ?? 0),
    }));
  },

  /**
   * Get detailed payment records for a specific date (YYYY-MM-DD)
   */
  async getDailyCollectionDetailsRaw(db: D1Instance, dateStr: string) {
    const dateFormatted = sql<string>`strftime('%Y-%m-%d', ${installmentTable.paidAt} / 1000, 'unixepoch', '+06:00')`;

    const result = await db
      .select({
        id: installmentTable.id,
        amountPaid: installmentTable.amountPaid,
        paidAt: installmentTable.paidAt,
        createdByName: installmentTable.createdByName,
        productName: productTable.productName,
        customerName: customerTable.name,
        customerPhone: customerTable.phoneNumber,
      })
      .from(installmentTable)
      .innerJoin(productTable, eq(installmentTable.productId, productTable.id))
      .innerJoin(customerTable, eq(productTable.customerId, customerTable.id))
      .where(sql`${dateFormatted} = ${dateStr}`)
      .orderBy(desc(installmentTable.paidAt));

    return result;
  },

  async getDailyCollectionsCountRaw(db: D1Instance): Promise<number> {
    const dateFormatted = sql<string>`strftime('%Y-%m-%d', ${installmentTable.paidAt} / 1000, 'unixepoch', '+06:00')`;

    const result = await db
      .select({ count: countDistinct(dateFormatted) })
      .from(installmentTable);

    return Number(result[0]?.count ?? 0);
  },
};