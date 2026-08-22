// src/modules/product/components/product-form.tsx
import { FieldError } from "@/components/ui/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type UseFormReturn,
  type FieldValues,
  type Path,
  Controller,
} from "react-hook-form";

interface ProductFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  customerId: string;
}

function unixToDateInputValue(unix?: number | null) {
  if (!unix) return "";
  return new Date(unix * 1000).toISOString().slice(0, 10);
}

function dateInputValueToUnix(value: string) {
  if (!value) return undefined;
  return Math.floor(new Date(value).getTime() / 1000);
}

export default function ProductForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  customerId,
}: ProductFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full pb-14"
    >
      {/* Hidden Customer ID Field */}
      <input
        type="hidden"
        value={customerId}
        {...register("customerId" as Path<T>)}
      />

      {form.getValues("id" as Path<T>) && (
        <input type="hidden" {...register("id" as Path<T>)} />
      )}

      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="productName" error={!!errors.productName}>
          Product Name
        </Label>
        <Input
          id="productName"
          disabled={isLoading}
          placeholder="e.g. Smartphone, Laptop"
          error={!!errors.productName}
          {...register("productName" as Path<T>)}
        />
        <FieldError message={errors?.productName?.message as string} />
      </div>

      {/* Total Price & Down Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalPrice" error={!!errors.totalPrice}>
            Total Price (BDT)
          </Label>
          <Input
            id="totalPrice"
            type="number"
            inputMode="numeric"
            disabled={isLoading}
            placeholder="0"
            error={!!errors.totalPrice}
            {...register("totalPrice" as Path<T>, { valueAsNumber: true })}
          />
          <FieldError message={errors?.totalPrice?.message as string} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="downPayment" error={!!errors.downPayment}>
            Down Payment (BDT)
          </Label>
          <Input
            id="downPayment"
            type="number"
            inputMode="numeric"
            disabled={isLoading}
            placeholder="0"
            error={!!errors.downPayment}
            {...register("downPayment" as Path<T>, { valueAsNumber: true })}
          />
          <FieldError message={errors?.downPayment?.message as string} />
        </div>
      </div>

      {/* Installment Amount & Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="installmentAmount" error={!!errors.installmentAmount}>
            Installment Amount (BDT)
          </Label>
          <Input
            id="installmentAmount"
            type="number"
            inputMode="numeric"
            disabled={isLoading}
            placeholder="0"
            error={!!errors.installmentAmount}
            {...register("installmentAmount" as Path<T>, { valueAsNumber: true })}
          />
          <FieldError message={errors?.installmentAmount?.message as string} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installmentDeadline" error={!!errors.installmentDeadline}>
            Installment Deadline
          </Label>
          <Controller
            control={control}
            name={"installmentDeadline" as Path<T>}
            render={({ field }) => (
              <Input
                id="installmentDeadline"
                type="date"
                disabled={isLoading}
                error={!!errors.installmentDeadline}
                value={unixToDateInputValue(field.value)}
                onChange={(e) =>
                  field.onChange(dateInputValueToUnix(e.target.value))
                }
                onClick={(e) => {
                  const input = e.currentTarget as HTMLInputElement;
                  input.showPicker?.();
                }}
              />
            )}
          />
          <FieldError message={errors?.installmentDeadline?.message as string} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <a href={`/customers/${customerId}/products`} className="w-full">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </a>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}