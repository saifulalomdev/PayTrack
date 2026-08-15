// customer-table-row.tsx
import {
  User,
  Pencil,
  Trash2,
  MoreVertical,
  Eye,
} from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import type { PublicCustomer } from "../customer-types";

interface CustomerTableRowProps extends Partial<PublicCustomer> {
  id?: string;
  isAdmin?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const guardianTypeLabel: Record<string, string> = {
  father: "পিতা",
  husband: "স্বামী",
};

export default function CustomerTableRow({
  id,
  name,
  serialNumber,
  guardianName,
  guardianType,
  phoneNumber,
  isDeleting,
  onDelete,
  onUpdate,
  address,
}: CustomerTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      {/* 1. Name */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>

          <a
            href={`/customers/${id}/products`}
            className="text-foreground hover:underline"
          >
            {name}
          </a>
        </div>
      </TableCell>

      {/* 2. Serial Number */}
      <TableCell>
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          #{serialNumber}
        </span>
      </TableCell>

      {/* 3. Guardian */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-foreground">{guardianName ?? "-"}</span>
          {guardianType && (
            <span className="text-xs text-muted-foreground">
              {guardianTypeLabel[guardianType] ?? guardianType}
            </span>
          )}
        </div>
      </TableCell>

      {/* 4. Phone Number */}
      <TableCell>
        <span className="text-foreground">{phoneNumber ?? "-"}</span>
      </TableCell>

      <TableCell>
        <span className="text-foreground">{address ?? "-"}</span>
      </TableCell>

      {/* 5. Actions */}
      <TableCell className="text-right">
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open options</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>Customer Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <a href={`/customers/${id}/products`}>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>View products</span>
                </a>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onUpdate} className="gap-2 cursor-pointer">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                <span>Update Details</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Customer</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Customer</AlertDialogTitle>
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
                {isDeleting ? "Deleting..." : "Delete Customer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}