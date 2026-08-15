// customer-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserX } from 'lucide-react';
import CustomerTableRow from './customer-table-row';
import type { PublicCustomer } from '../customer-types';

interface CustomerTableProps {
  customers: PublicCustomer[];
  isAdmin: boolean;
  deletingId?: string | null;
  onDelete: (id: string) => void;
  onUpdate?: (id: string) => void;
}

export default function CustomerTable({
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
            <TableHead>নাম</TableHead>
            <TableHead>সিরিয়াল</TableHead>
            <TableHead>অভিভাবক</TableHead>
            <TableHead>ফোন নম্বর</TableHead>
            <TableHead>ঠিকানা</TableHead>
            <TableHead className='text-right'>অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              {/* Changed colSpan from 5 to 6 */}
              <TableCell colSpan={6} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UserX className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">কোনো গ্রাহক পাওয়া যায়নি।</p>
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