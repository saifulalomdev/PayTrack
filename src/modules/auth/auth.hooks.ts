import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { actions } from "astro:actions";
import { useAction } from "@/hooks/use-action";
import { LoginInput, loginSchema } from "./auth.schema";

export default function useLogIn() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test@admin.com",
      password: "admin-password",
    },
  });

  // Setup the action runner using your custom hook
  const { execute, isLoading } = useAction(
    actions.login,
    {
      loadingMessage: "Logging you in...",
      successMessage: "Login successful! Redirecting...",
      onSuccess: (res) => {
        if (res?.success) {
          form.reset();
          window.location.assign("/dashboard");
        }
      },

      onError: (errMsg) => {
        console.error("Login failed:", errMsg);
      },
    }
  );

  // The form submit handler now just pipes data into execute
  const onSubmit = (data: LoginInput) => {
    execute(data);
  };

  return { form, onSubmit, isLoading };
}