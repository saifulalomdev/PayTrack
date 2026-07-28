import { Button } from "@/components/ui/button";
import {
  Trash2,
  Pencil,
  MoreVertical,
  User,
  Phone,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { InsertStaff } from "../staff.types";

interface StaffCardProps extends Partial<InsertStaff> {
  id?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function StaffCard({
  id,
  name,
  role = "staff",
  phoneNumber,
  isDeleting,
  onDelete,
  onUpdate,
}: StaffCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isAdmin = role === "admin";

  return (
    <Card className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Avatar and Staff Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base leading-none text-foreground">
                {name}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  isAdmin
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                )}
              >
                <Shield className="h-3 w-3" />
                {role}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions Dropdown */}
        <div className="flex items-center">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open options</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44" align="end">
                <DropdownMenuLabel>Staff Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onUpdate} className="gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span>Edit Details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Staff</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong className="text-foreground">{name}</strong>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete?.();
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Member"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
}