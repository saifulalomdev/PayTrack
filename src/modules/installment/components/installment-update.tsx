// src/modules/installment/components/installment-update.tsx
import { PageHeader } from "@/components/ui/page-header";
import { useFormAction } from "@/hooks/use-form-action";
import { updateInstallmentSchema } from "../installment-schema";
import type { PublicInstallment } from "../installment-types";
import ErrorAlert from "@/components/ui/error-alert";
import { InstallmentForm } from "./installment-form";
import { actions } from "astro:actions";

interface InstallmentUpdateProps {
  productId: string;
  customerId: string;
  installmentData: PublicInstallment;
  errorMsg?: string;
}

export function InstallmentUpdate({
  productId,
  customerId,
  installmentData,
  errorMsg,
}: InstallmentUpdateProps) {
  const backHref = `/customers/${customerId}/products/${productId}/installments`;

  const { form, onSubmit, isLoading } = useFormAction({
    actionFn: actions.installment.updateInstallment,
    defaultValues: {
      id: installmentData.id,
      productId,
      amountPaid: installmentData.amountPaid,
    },
    schema: updateInstallmentSchema,
    loadingMessage: "Updating installment...",
    successMessage: "Installment updated successfully!",
    onSuccess: () => {
      window.location.href = backHref;
    },
  });

  return (
    <div className="space-y-4">
      <ErrorAlert errorMsg={errorMsg} />
      <PageHeader title="Update Installment" />
      <InstallmentForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        backHref={backHref}
      />
    </div>
  );
}