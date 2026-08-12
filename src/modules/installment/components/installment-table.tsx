// src/modules/installment/components/installment-table.tsx
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
import { Receipt, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { PublicInstallment } from '../installment-types';

interface InstallmentTableProps {
  installments: PublicInstallment[];
  isDeleting: boolean;
  canManage: boolean; // update + delete are admin-only, see installment-actions.ts
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatBDT(amount?: number | null) {
  if (amount === undefined || amount === null) return '—';
  return `৳${amount.toLocaleString('bn-BD')}`;
}

function formatDate(unix?: number | null) {
  if (!unix) return '—';
  return new Date(unix * 1000).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function InstallmentTable({
  installments,
  isDeleting,
  canManage,
  onUpdate,
  onDelete,
}: InstallmentTableProps) {
  const isEmpty = !installments || installments.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>পরিমাণ</TableHead>
            <TableHead>তারিখ</TableHead>
            <TableHead>যিনি নিয়েছেন</TableHead>
            {canManage && <TableHead className='text-right'>অ্যাকশন</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={canManage ? 4 : 3} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Receipt className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">এখনো কোনো কিস্তি যোগ করা হয়নি।</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            installments.map((installment) => (
              <TableRow key={installment.id}>
                <TableCell className="font-medium">{formatBDT(installment.amountPaid)}</TableCell>
                <TableCell>{formatDate(installment.paidAt)}</TableCell>
                <TableCell className="text-muted-foreground">{installment.createdByName}</TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" className='rounded-full' disabled={isDeleting}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onUpdate(installment.id)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          সম্পাদনা করুন
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(installment.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          মুছে ফেলুন
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