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
import { TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
import { cn } from "@/utils/utils";
import { InsertStaff } from "../staff-types";

interface StaffTableRowProps extends Partial<InsertStaff> {
  id?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function StaffTableRow({
  id,
  name,
  role = "staff",
  phoneNumber,
  isDeleting,
  onDelete,
  onUpdate,
}: StaffTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isAdmin = role === "admin";

  return (
    <TableRow>
      {/* Name and Avatar */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <span className="font-medium text-foreground">{name}</span>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell className="uppercase">
        {/* <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            isAdmin
              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
          )}
        >
          <Shield className="h-3 w-3" /> */}
          {role}
        {/* </span> */}
      </TableCell>

      {/* Phone Number */}
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5" />
          <span>{phoneNumber}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
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
                <span>Update Details</span>
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
      </TableCell>
    </TableRow>
  );
}