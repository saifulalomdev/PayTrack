// src/modules/staff/components/staff-table.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Trash2, Pencil, MoreVertical, User, Phone, Users, Plus } from "lucide-react";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import type { PublicStaff } from "../staff-types";

/* -------------------------------------------------------------------------- */
/*                              STAFF EMPTY STATE                             */
/* -------------------------------------------------------------------------- */

export function StaffEmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={4} className="h-64 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">No Staff Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You haven't added any staff members yet. Click the button below to add your first staff.
          </p>
          <Button asChild className="mt-2 uppercase" size="sm">
            <a href="/staff/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Staff
            </a>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* -------------------------------------------------------------------------- */
/*                               STAFF TABLE ROW                              */
/* -------------------------------------------------------------------------- */

interface StaffTableRowProps {
  member: PublicStaff;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function StaffTableRow({
  member,
  onUpdate,
  onDelete,
  isDeleting = false,
}: StaffTableRowProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <TableRow>
      {/* Name and Avatar */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <span className="font-medium text-foreground">{member.name}</span>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell className="uppercase font-medium">
        {member.role}
      </TableCell>

      {/* Phone Number with Existing Copy Component */}
      <TableCell className="text-muted-foreground">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3.5 w-3.5" />
          <span>{member.phoneNumber}</span>
          <CopyToClipboard
            data={member.phoneNumber}
            title=""
            successMessage="Phone number copied!"
            errorMessage="Failed to copy phone number."
          />
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

              <DropdownMenuItem onClick={() => onUpdate(member.id)} className="gap-2 cursor-pointer">
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
                Are you sure you want to delete <strong className="text-foreground">{member.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(member.id);
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

/* -------------------------------------------------------------------------- */
/*                                 STAFF TABLE                                */
/* -------------------------------------------------------------------------- */

interface StaffTableProps {
  staff: PublicStaff[] | null | undefined;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export function StaffTable({ staff, onUpdate, onDelete, deletingId }: StaffTableProps) {
  const isEmpty = !staff || staff.length === 0;

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <StaffEmptyState />
          ) : (
            staff.map((member) => (
              <StaffTableRow
                key={member.id}
                member={member}
                isDeleting={deletingId === member.id}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}