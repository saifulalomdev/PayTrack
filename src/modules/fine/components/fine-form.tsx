// src/modules/fine/components/fine-form.tsx
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type {
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

interface FineFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  cancelHref?: string;
}

export function FineForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  cancelHref = "/",
}: FineFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 pb-16">
      {/* Amount */}
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          disabled={isLoading}
          placeholder="0"
          {...register("amount" as Path<T>, { valueAsNumber: true })}
        />
        <FieldError message={errors.amount?.message as string | undefined} />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          disabled={isLoading}
          placeholder="Reason for the fine"
          {...register("note" as Path<T>)}
        />
        <FieldError message={errors.note?.message as string | undefined} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <a href={cancelHref} className="w-full">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </a>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}