// src/modules/fine/components/fine-update.tsx

import { useFormAction } from "@/hooks/use-form-action";
import type { PublicFine } from "../fine-types";
import { actions } from "astro:actions";
import { updateFineSchema } from "../fine-schema";
import ErrorAlert from "@/components/ui/error-alert";
import { PageHeader } from "@/components/ui/page-header";
import { FineForm } from "./fine-form";

export function FineUpdate({ 
  fineData, 
  customerId, 
  productId, 
  errorMsg 
}: { 
  fineData: PublicFine;
  customerId: string; 
  productId: string; 
  errorMsg?: string 
}) {
  const { form, onSubmit, isLoading } = useFormAction({
    actionFn: actions.fine.updateFine,
    defaultValues: {
      amount: fineData.amount,
      note: fineData.note,
    },
    schema: updateFineSchema,
    loadingMessage: "Updating fine...",
    successMessage: "Fine updated successfully!",
    onSuccess: () => {
      window.location.href = `/customers/${customerId}/products/${productId}/installments`;
    }
  });

  const handleUpdate = (data: any) => onSubmit({ ...data, id: fineData.id });

  return (
    <div className='space-y-4'>
      <ErrorAlert errorMsg={errorMsg} />
      <PageHeader title='Update Fine Information' />
      <FineForm
        form={form}
        onSubmit={handleUpdate}
        isLoading={isLoading}
        cancelHref={`/customers/${customerId}/products/${productId}/fines`}
      />
    </div>
  );
}