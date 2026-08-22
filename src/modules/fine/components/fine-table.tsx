// src/modules/fine/components/fine-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ReceiptText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { PublicFine } from '../fine-types';

interface FineTableProps {
  fines: PublicFine[];
  isDeleting: boolean;
  isAdmin?: boolean;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatBDT(amount?: number | null) {
  if (amount === undefined || amount === null) return '—';
  return `৳${amount.toLocaleString('en-US')}`;
}

function formatDate(unix?: number | null) {
  if (!unix) return '—';
  // Multiply by 1000 to convert seconds to milliseconds
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function FineTable({
  fines,
  isDeleting,
  isAdmin = false,
  onUpdate,
  onDelete,
}: FineTableProps) {
  const isEmpty = !fines || fines.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead className='text-right'>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={isAdmin ? 5 : 4} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ReceiptText className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">No fines found.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            fines.map((fine) => (
              <TableRow key={fine.id}>
                <TableCell className="font-medium">{formatBDT(fine.amount)}</TableCell>
                <TableCell className="max-w-xs truncate">{fine.note}</TableCell>
                <TableCell className="text-muted-foreground">{fine.createdByName}</TableCell>
                <TableCell>{formatDate(fine.createdAt)}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className='rounded-full' disabled={isDeleting}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdate(fine.id)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(fine.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}