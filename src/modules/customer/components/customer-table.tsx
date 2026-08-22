// src/modules/customer/components/customer-table.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserX } from 'lucide-react';
import type { PublicCustomer } from '../customer-types';
import {
  User,
  Pencil,
  Trash2,
  MoreVertical,
  Eye,
} from "lucide-react";
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

interface CustomerTableProps {
  customers: PublicCustomer[];
  isAdmin: boolean;
  deletingId?: string | null;
  onDelete: (id: string) => void;
  onUpdate?: (id: string) => void;
}

export function CustomerTable({
  customers,
  isAdmin,
  deletingId,
  onDelete,
  onUpdate,
}: CustomerTableProps) {
  const isEmpty = !customers || customers.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Serial</TableHead>
            <TableHead>Guardian</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UserX className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">No customers found.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                {...customer}
                isAdmin={isAdmin}
                isDeleting={deletingId === customer.id}
                onUpdate={() => onUpdate?.(customer.id)}
                onDelete={() => onDelete(customer.id)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface CustomerTableRowProps extends Partial<PublicCustomer> {
  id?: string;
  isAdmin?: boolean;
  onUpdate?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const guardianTypeLabel: Record<string, string> = {
  father: "Father",
  husband: "Husband",
};

function CustomerTableRow({
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
            <span className="text-xs text-muted-foreground capitalize">
              {guardianTypeLabel[guardianType] ?? guardianType}
            </span>
          )}
        </div>
      </TableCell>

      {/* 4. Phone Number */}
      <TableCell>
        <span className="text-foreground">{phoneNumber ?? "-"}</span>
      </TableCell>

      {/* 5. Address */}
      <TableCell>
        <span className="text-foreground">{address ?? "-"}</span>
      </TableCell>

      {/* 6. Actions */}
      <TableCell className="text-right">
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuLabel>Customer Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <a href={`/customers/${id}/products`}>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>View Products</span>
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