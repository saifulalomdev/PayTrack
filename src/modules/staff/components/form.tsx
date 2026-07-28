import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { InsertStaff } from "../staff.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StaffFormDialogProps {
    form: UseFormReturn<InsertStaff>;
    onSubmit: (data: InsertStaff) => void;
    isLoading?: boolean;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (state: boolean) => void;
}

export function StaffFormDialog({
    form,
    onSubmit,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
}: StaffFormDialogProps) {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-106">
                <DialogHeader>
                    <DialogTitle>Add New Staff</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            disabled={isLoading}
                            placeholder="John Doe"
                            {...register("name")}
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
                            {...register("phoneNumber")}
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
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password.message as string}</p>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            disabled={isLoading}
                            {...register("role")}
                        >
                            <SelectTrigger className="w-full rounded-full p-4">
                                <SelectValue defaultValue="staff" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">
                                    Staff
                                </SelectItem>
                                <SelectItem value="admin">
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-red-500 text-sm">{errors.role.message as string}</p>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex-1">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Saving..." : "Create Staff"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}