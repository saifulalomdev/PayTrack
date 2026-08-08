import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Controller,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
}

export function StaffForm<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
}: StaffFormProps<T>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 pb-16">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          disabled={isLoading}
          placeholder="John Doe"
          {...register("name" as Path<T>)}
        />
        <FieldError message={errors.name?.message as string | undefined} />
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          disabled={isLoading}
          placeholder="01*********"
          {...register("phoneNumber" as Path<T>)}
        />
        <FieldError message={errors.phoneNumber?.message as string | undefined} />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          placeholder="••••••••"
          {...register("password" as Path<T>)}
        />
        <FieldError message={errors.password?.message as string | undefined} />
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Controller
          control={control}
          name={"role" as Path<T>}
          render={({ field }) => (
            <Select
              disabled={isLoading}
              value={field.value ?? ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder="Select role"
                  className="uppercase"
                />
              </SelectTrigger>
              <SelectContent className="uppercase">
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.role?.message as string | undefined} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <a href="/staff" className="w-full">
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