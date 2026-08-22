// src/modules/installment/index.ts
export * from "./installment-schema";
export * from "./installment-types";
export * from "./installment-actions";
export { installmentService } from "./installment-service";
export { InstallmentAdd } from "./components/installment-add";
export { InstallmentUpdate } from "./components/installment-update";
export { InstallmentManager } from "./components/installment-manager";