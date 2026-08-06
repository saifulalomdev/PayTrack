import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, UseFormReturn, FieldValues, Path } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const { register, handleSubmit, control, formState: { errors } } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    disabled={isLoading}
                    placeholder="John Doe"
                    {...register("name" as Path<T>)}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message as string}</p>
                )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    disabled={isLoading}
                    placeholder="+123456789"
                    {...register("phoneNumber" as Path<T>)}
                />
                {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber.message as string}</p>
                )}
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
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message as string}</p>
                )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Controller
                    control={control}
                    name={"role" as Path<T>}
                    render={({ field }) => (
                        <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                            value={field.value ?? ""}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" className="uppercase" />
                            </SelectTrigger>
                            <SelectContent className="uppercase">
                                <SelectItem value="staff" className="uppercase">Staff</SelectItem>
                                <SelectItem value="admin" className="uppercase">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.role && (
                    <p className="text-red-500 text-sm">{errors.role.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="/staff" className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                        Cancel
                    </Button>
                </a>
                <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Saving..." : "Save"}
                </Button>
            </div>
        </form>
    );
}