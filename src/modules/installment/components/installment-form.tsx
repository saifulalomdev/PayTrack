// src/modules/installment/components/installment-form.tsx
import { FieldError } from "@/components/ui/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface InstallmentFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  backHref: string;
}

export function InstallmentForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  backHref,
}: InstallmentFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full pb-14">
      <input type="hidden" {...register("productId" as Path<T>)} />

      <div className="space-y-2">
        <Label htmlFor="amountPaid" error={!!errors.amountPaid}>
          Amount Paid (BDT)
        </Label>
        <Input
          id="amountPaid"
          type="number"
          inputMode="numeric"
          disabled={isLoading}
          placeholder="5000"
          error={!!errors.amountPaid}
          {...register("amountPaid" as Path<T>, { valueAsNumber: true })}
        />
        <FieldError message={errors?.amountPaid?.message as string} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <a href={backHref} className="w-full">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </a>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Installment"}
        </Button>
      </div>
    </form>
  );
}