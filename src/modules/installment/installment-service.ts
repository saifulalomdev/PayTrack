// src/modules/installment/installment-service.ts
import { installmentRepository } from "./installment-repository";
import { productRepository } from "@/modules/product/product-repository";
import type { D1Instance } from "@/utils";
import type { InsertInstallment } from "./installment-types";

export const installmentService = {
  create: async (db: D1Instance, data: InsertInstallment) => {
    // Guard: don't let payments get recorded against a product that
    // doesn't exist (e.g. stale form, deleted product in another tab).
    const product = await productRepository.findCustomerProductById(db, data.productId);

    if (!product) {
      throw new Error("পণ্যটি খুঁজে পাওয়া যায়নি।");
    }

    // Guard: don't let total payments exceed what's actually owed.
    // (totalPrice - downPayment) is the amount installments are meant to
    // cover; downPayment itself is recorded on the product, not here.
    const alreadyPaid = await installmentRepository.getTotalPaidByProductId(db, data.productId);
    const owed = product.totalPrice - product.downPayment;
    const remaining = owed - alreadyPaid;

    if (data.amountPaid > remaining) {
      throw new Error(
        `পরিশোধের পরিমাণ বাকি টাকার (৳${remaining}) চেয়ে বেশি হতে পারবে না।`
      );
    }

    return await installmentRepository.createInstallment(db, data);
  },

  listByProductId: async (db: D1Instance, productId: string) => {
    return await installmentRepository.findInstallmentsByProductId(db, productId);
  },

  /**
   * Core "how much is left to pay" calculation.
   * remaining = totalPrice - downPayment - sum(installments paid)
   */
  getBalance: async (db: D1Instance, productId: string) => {
    const product = await productRepository.findCustomerProductById(db, productId);

    if (!product) {
      throw new Error("পণ্যটি খুঁজে পাওয়া যায়নি।");
    }

    const totalPaid = await installmentRepository.getTotalPaidByProductId(db, productId);
    const owed = product.totalPrice - product.downPayment;
    const remaining = Math.max(owed - totalPaid, 0);
    const isFullyPaid = remaining === 0;

    return {
      totalPrice: product.totalPrice,
      downPayment: product.downPayment,
      totalPaid,
      owed,
      remaining,
      isFullyPaid,
    };
  },

  delete: async (db: D1Instance, id: string) => {
    const deleted = await installmentRepository.deleteInstallmentById(db, id);

    if (!deleted) {
      throw new Error("কিস্তিটি খুঁজে পাওয়া যায়নি।");
    }

    return deleted;
  },
};