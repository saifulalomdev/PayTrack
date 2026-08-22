// src/modules/installment/installment-service.ts
import { installmentRepository } from "./installment-repository";
import { productRepository } from "@/modules/product/product-repository";
import { fineRepository } from "@/modules/fine/fine-repository";
import type { D1Instance } from "@/utils";
import type { InsertInstallment, UpdateInstallment } from "./installment-types";

export const installmentService = {
  create: async (db: D1Instance, data: InsertInstallment) => {
    const product = await productRepository.findCustomerProductById(db, data.productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    const alreadyPaid = await installmentRepository.getTotalPaidByProductId(db, data.productId);
    const totalFines = await fineRepository.getTotalByProductId(db, data.productId);
    // Fines add to what's owed, the same way downPayment subtracts from it.
    const owed = product.totalPrice - product.downPayment + totalFines;
    const remaining = owed - alreadyPaid;

    if (data.amountPaid > remaining) {
      throw new Error(
        `Payment amount cannot be greater than the remaining balance (৳${remaining}).`
      );
    }

    return await installmentRepository.createInstallment(db, data);
  },

  listByProductId: async (db: D1Instance, productId: string) => {
    return await installmentRepository.findInstallmentsByProductId(db, productId);
  },

  getById: async (db: D1Instance, id: string) => {
    const installment = await installmentRepository.findInstallmentById(db, id);

    if (!installment) {
      throw new Error("Installment not found.");
    }

    return installment;
  },

  update: async (db: D1Instance, id: string, data: UpdateInstallment) => {
    const existing = await installmentRepository.findInstallmentById(db, id);

    if (!existing) {
      throw new Error("Installment not found.");
    }

    if (existing.productId !== data.productId) {
      throw new Error("This installment does not belong to this product.");
    }

    const product = await productRepository.findCustomerProductById(db, data.productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    // Exclude this installment's own current amount from "already paid"
    // before checking the new amount against what's remaining.
    const paidByOthers = await installmentRepository.getTotalPaidByProductIdExcluding(
      db,
      data.productId,
      id
    );
    const totalFines = await fineRepository.getTotalByProductId(db, data.productId);
    const owed = product.totalPrice - product.downPayment + totalFines;
    const remaining = owed - paidByOthers;

    if (data.amountPaid > remaining) {
      throw new Error(
        `Payment amount cannot be greater than the remaining balance (৳${remaining}).`
      );
    }

    const updated = await installmentRepository.updateInstallmentById(db, id, data);

    if (!updated) {
      throw new Error("Failed to update installment.");
    }

    return updated;
  },

  /**
   * remaining = totalPrice - downPayment + totalFines - sum(installments paid)
   *
   * Fines are treated as additional charges on top of the product price —
   * the same role downPayment plays in the opposite direction. A product
   * is only "fully paid" once installments have covered the original
   * price AND any fines levied against it.
   */
  getBalance: async (db: D1Instance, productId: string) => {
    const product = await productRepository.findCustomerProductById(db, productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    const totalPaid = await installmentRepository.getTotalPaidByProductId(db, productId);
    const totalFines = await fineRepository.getTotalByProductId(db, productId);
    const owed = product.totalPrice - product.downPayment + totalFines;
    const remaining = Math.max(owed - totalPaid, 0);
    const isFullyPaid = remaining === 0;

    return {
      totalPrice: product.totalPrice,
      downPayment: product.downPayment,
      totalFines,
      totalPaid,
      owed,
      remaining,
      isFullyPaid,
    };
  },

  delete: async (db: D1Instance, id: string) => {
    const deleted = await installmentRepository.deleteInstallmentById(db, id);

    if (!deleted) {
      throw new Error("Installment not found.");
    }

    return deleted;
  },
};