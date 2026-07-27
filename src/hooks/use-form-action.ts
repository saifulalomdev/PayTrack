import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn, type DefaultValues, type FieldValues } from "react-hook-form";
import { useAction } from "@/hooks/use-action";
import type { ZodType } from "zod";

interface UseFormActionOptions<TFieldValues extends FieldValues, TData> {
    schema: ZodType<TFieldValues, any, any>;
    defaultValues: DefaultValues<TFieldValues>;
    actionFn: (input: TFieldValues) => Promise<{ data?: TData; error?: any }>;
    loadingMessage?: string;
    successMessage?: string;
    onSuccess?: (data: TData) => void;
}

interface UseFormActionReturn<TFieldValues extends FieldValues> {
    form: UseFormReturn<TFieldValues, any>;
    onSubmit: (data: TFieldValues) => void;
}

export function useFormAction<TFieldValues extends FieldValues, TData = any>({
    schema,
    defaultValues,
    actionFn,
    loadingMessage,
    successMessage,
    onSuccess,
}: UseFormActionOptions<TFieldValues, TData>): UseFormActionReturn<TFieldValues> {

    const form = useForm<TFieldValues>({
        resolver: zodResolver(schema) as any,
        defaultValues,
    });

    const { execute } = useAction(actionFn, {
        loadingMessage,
        successMessage,
        onSuccess: (data) => {
            form.reset();
            onSuccess?.(data);
        },
    });

    const onSubmit = (data: TFieldValues) => {
        execute(data);
    };

    return { form, onSubmit };
}