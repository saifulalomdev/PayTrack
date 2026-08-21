import { loginDefaultValue } from "../auth-default-values";
import { FieldError } from "@/components/ui/field-error";
import { useFormAction } from "@/hooks/use-form-action";
import { Button } from "@/components/ui/button";
import type { LoginInput } from "../auth-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "../auth-schema";
import { actions } from "astro:actions";

export function LoginForm() {
  const { form, onSubmit, isLoading } = useFormAction<LoginInput>({
    actionFn: actions.auth.login,
    defaultValues: loginDefaultValue,
    schema: loginSchema,
    loadingMessage: "লগইন করা হচ্ছে...",
    successMessage: "সফলভাবে লগইন করা হয়েছে!",
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm border p-6 rounded-xl shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-center">লগইন করুন</h1>
        <p className="text-sm text-gray-500 text-center">আপনার অ্যাকাউন্ট তথ্য দিয়ে প্রবেশ করুন</p>
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        {/* Pass error status to change text label state color */}
        <Label htmlFor="phoneNumber" error={!!errors.phoneNumber}>
          মোবাইল নম্বর
        </Label>
        <Input
          id="phoneNumber"
          type="text"
          disabled={isLoading}
          placeholder="01700000000"
          error={!!errors.phoneNumber}
          {...register("phoneNumber")}
        />
        <FieldError message={errors?.phoneNumber?.message} />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        {/* Pass error status to change text label state color */}
        <Label htmlFor="password" error={!!errors.password}>
          পাসওয়ার্ড
        </Label>
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          placeholder="••••••••"
          error={!!errors.password}
          {...register("password")}
        />
        <FieldError message={errors?.password?.message} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "অপেক্ষা করুন..." : "লগইন"}
      </Button>
    </form>
  );
}
