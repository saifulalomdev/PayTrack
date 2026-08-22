// src/modules/customer/components/customer-form.tsx

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type UseFormReturn, type FieldValues, type Path, Controller } from "react-hook-form";

interface CustomerFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
}

export function CustomerForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
}: CustomerFormProps<T>) {
  const { register, handleSubmit, control, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 pb-14">
      {/* Serial Number */}
      <div className="space-y-2">
        <Label htmlFor="serialNumber" error={!!errors.serialNumber}>
          Serial Number
        </Label>
        <Input
          id="serialNumber"
          disabled={isLoading}
          type="number"
          placeholder="e.g. 1001"
          error={!!errors.serialNumber}
          {...register("serialNumber" as Path<T>)}
        />
        <FieldError message={errors?.serialNumber?.message as string} />
      </div>

      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="name" error={!!errors.name}>
          Customer Name
        </Label>
        <Input
          id="name"
          disabled={isLoading}
          placeholder="e.g. John Doe"
          error={!!errors.name}
          {...register("name" as Path<T>)}
        />
        <FieldError message={errors?.name?.message as string} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guardian Name */}
        <div className="space-y-2">
          <Label htmlFor="guardianName" error={!!errors.guardianName}>
            Guardian Name
          </Label>
          <Input
            id="guardianName"
            disabled={isLoading}
            placeholder="e.g. Robert Doe"
            error={!!errors.guardianName}
            {...register("guardianName" as Path<T>)}
          />
          <FieldError message={errors?.guardianName?.message as string} />
        </div>

        {/* Guardian Type */}
        <div className="space-y-2">
          <Label htmlFor="guardianType" error={!!errors.guardianType}>
            Guardian Type
          </Label>
          <Controller
            name={"guardianType" as Path<T>}
            control={control}
            render={({ field }) => (
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value ?? ""}
              >
                <SelectTrigger id="guardianType" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="husband">Husband</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors?.guardianType?.message as string} />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" error={!!errors.phoneNumber}>
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          disabled={isLoading}
          type="tel"
          placeholder="01700000000"
          error={!!errors.phoneNumber}
          {...register("phoneNumber" as Path<T>)}
        />
        <FieldError message={errors?.phoneNumber?.message as string} />
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" error={!!errors.address}>
          Address
        </Label>
        <Textarea
          id="address"
          disabled={isLoading}
          placeholder="e.g. Village, Post Office, Sub-district, District"
          {...register("address" as Path<T>)}
        />
        <FieldError message={errors?.address?.message as string} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/customers" className="w-full">
          <Button type="button" variant="outline" className="w-full">
            Cancel
          </Button>
        </a>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Saving..." : "Save Customer"}
        </Button>
      </div>
    </form>
  );
}