// src/modules/installment/components/installment-update.tsx
import { PageHeader } from "@/components/ui/page-header";
import { useFormAction } from "@/hooks/use-form-action";
import { updateInstallmentSchema } from "../installment-schema";
import type { UpdateInstallment } from "../installment-types";
import ErrorAlert from "@/components/ui/error-alert";
import { InstallmentForm } from "./installment-form";
import { actions } from "astro:actions";

interface InstallmentUpdateProps {
  productId: string;
  customerId: string;
  installmentData: UpdateInstallment;
  errorMsg?: string;
}

export function InstallmentUpdate({
  productId,
  customerId,
  installmentData,
  errorMsg,
}: InstallmentUpdateProps) {
  const backHref = `/customers/${customerId}/products/${productId}/installments`;

  const { form, onSubmit, isLoading } = useFormAction<UpdateInstallment, any>({
    actionFn: actions.installment.updateInstallment,
    defaultValues: installmentData,
    schema: updateInstallmentSchema,
    loadingMessage: "কিস্তি আপডেট হচ্ছে...",
    successMessage: "কিস্তি সফলভাবে আপডেট হয়েছে!",
    onSuccess: () => {
      window.location.href = backHref;
    },
  });

  return (
    <div className="space-y-4">
      <ErrorAlert errorMsg={errorMsg} />
      <PageHeader title="কিস্তি আপডেট করুন" />
      <InstallmentForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        backHref={backHref}
      />
    </div>
  );
}