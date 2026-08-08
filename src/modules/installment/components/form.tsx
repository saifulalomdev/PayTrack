import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Controller, UseFormReturn, FieldValues, Path } from "react-hook-form";

interface InstallmentFormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    onSubmit: (data: T) => void;
    isLoading?: boolean;
    // Where "cancel" and "back" links should point — usually the parent
    // customer's detail page, since installments don't have their own
    // standalone list view.
    backHref: string;
}

// paidAt is stored as a unix timestamp (seconds), but <input type="date">
// needs/returns a "YYYY-MM-DD" string — these convert at the form boundary.
function unixToDateInputValue(unix?: number | null) {
    if (!unix) return "";
    return new Date(unix * 1000).toISOString().slice(0, 10);
}

function dateInputValueToUnix(value: string) {
    if (!value) return undefined;
    return Math.floor(new Date(value).getTime() / 1000);
}

export function InstallmentForm<T extends FieldValues>({
    form,
    onSubmit,
    isLoading,
    backHref,
}: InstallmentFormProps<T>) {
    const { register, handleSubmit, control, formState: { errors } } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

            {/* customerId travels with the form but is never shown/typed by
                the user — it's fixed by whichever customer's page this form
                was opened from (see AddNewInstallment). */}
            <input type="hidden" {...register("customerId" as Path<T>)} />

            <div className="space-y-2">
                <Label htmlFor="amount">পরিশোধের পরিমাণ (৳)</Label>
                <Input
                    id="amount"
                    type="number"
                    disabled={isLoading}
                    placeholder="৫০০০"
                    {...register("amount" as Path<T>, { valueAsNumber: true })}
                />
                {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount.message as string}</p>
                )}
            </div>

            {/* Note */}
            <div className="space-y-2">
                <Label htmlFor="note">নোট (ঐচ্ছিক)</Label>
                <Input
                    id="note"
                    disabled={isLoading}
                    placeholder="যেমনঃ নগদে পরিশোধ করা হয়েছে"
                    {...register("note" as Path<T>)}
                />
                {errors.note && (
                    <p className="text-red-500 text-sm">{errors.note.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href={backHref} className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                        বাতিল
                    </Button>
                </a>
                <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
                </Button>
            </div>
        </form>
    );
}