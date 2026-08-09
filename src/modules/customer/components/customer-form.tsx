import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UseFormReturn, type FieldValues, type Path } from "react-hook-form";
import { Controller } from 'react-hook-form';

interface CustomerFormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    onSubmit: (data: T) => void;
    isLoading?: boolean;
}

// installmentDeadline is stored as a unix timestamp (seconds) in the DB,
// but <input type="date"> needs/returns a "YYYY-MM-DD" string — these two
// helpers convert between the two at the form boundary only.
function unixToDateInputValue(unix?: number | null) {
    if (!unix) return "";
    return new Date(unix * 1000).toISOString().slice(0, 10);
}

function dateInputValueToUnix(value: string) {
    if (!value) return undefined;
    return Math.floor(new Date(value).getTime() / 1000);
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
                <Label htmlFor="serialNumber">সিরিয়াল নম্বর</Label>
                <Input
                    id="serialNumber"
                    disabled={isLoading}
                    type="number"
                    placeholder="যেমনঃ 1001"
                    {...register("serialNumber" as Path<T>)}
                />
                {errors.serialNumber && (
                    <p className="text-red-500 text-sm">{errors.serialNumber.message as string}</p>
                )}
            </div>

            {/* Customer Name */}
            <div className="space-y-2">
                <Label htmlFor="name">গ্রাহকের নাম</Label>
                <Input
                    id="name"
                    disabled={isLoading}
                    placeholder="যেমনঃ রহিম উদ্দিন"
                    {...register("name" as Path<T>)}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/customers" className="w-full">
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