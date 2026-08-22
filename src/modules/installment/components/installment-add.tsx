// src/modules/installment/components/installment-add.tsx
import { PageHeader } from "@/components/ui/page-header";
import { useFormAction } from "@/hooks/use-form-action";
import { insertInstallmentSchema } from "../installment-schema";
import type { InsertInstallment } from "../installment-types";
import { InstallmentForm } from "./installment-form";
import { actions } from "astro:actions";

interface InstallmentAddProps {
  productId: string;
  customerId: string;
}

export function InstallmentAdd({ productId, customerId }: InstallmentAddProps) {
  const backHref = `/customers/${customerId}/products/${productId}/installments`;

  const { form, onSubmit, isLoading } = useFormAction<InsertInstallment, any>({
    actionFn: actions.installment.createInstallment,
    defaultValues: {
      productId,
      amountPaid: undefined,
    } as any,
    schema: insertInstallmentSchema,
    loadingMessage: "Saving installment...",
    successMessage: "Installment added successfully!",
    onSuccess: () => {
      window.location.href = backHref;
    },
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Add New Installment" />
      <InstallmentForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        backHref={backHref}
      />
    </div>
  );
}