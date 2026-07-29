import { useFormAction } from "@/hooks/use-form-action";
import { actions } from "astro:actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginInput, loginSchema } from "../auth.schema";

export function LoginForm() {
  const { form, onSubmit, isLoading } = useFormAction<LoginInput>({
    actionFn: actions.staff.loginStaff,
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
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

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">মোবাইল নম্বর</Label>
        <Input
          id="phoneNumber"
          type="text"
          disabled={isLoading}
          placeholder="01700000000"
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "অপেক্ষা করুন..." : "লগইন"}
      </Button>
    </form>
  );
}