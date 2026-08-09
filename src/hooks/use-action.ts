import { useState } from "react";
import { toast } from "sonner";

interface UseActionOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  loadingMessage?: string;
}

type ActionResult<TData> = {
  data?: TData;
  error?: { message?: string } | string | null;
};

export function useAction<TInput, TData>(actionFn: (input: TInput) => Promise<ActionResult<TData>>, options?: UseActionOptions<TData>) {

  const [isLoading, setIsLoading] = useState(false);

  const execute = async (input: TInput) => {
    const toastId = toast.loading(options?.loadingMessage ?? "Processing your request...");

    try {
      setIsLoading(true)
      const result = await actionFn(input);

      if (result.error) {
        const errMsg =
          typeof result.error === "string"
            ? result.error
            : result.error.message ?? "An unexpected error occurred.";

        options?.onError?.(errMsg);
        toast.error(errMsg, { id: toastId });
        return;
      }

      toast.success(options?.successMessage ?? "Success", { id: toastId });

      if (result.data) {
        options?.onSuccess?.(result.data);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to execute action.";
      options?.onError?.(errMsg);
      toast.error(errMsg, { id: toastId });
    } finally {
      setIsLoading(false)
    }
  };

  return { execute, isLoading };
}