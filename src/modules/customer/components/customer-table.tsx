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
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

export default function CustomerTable({
  customers,
  isAdmin,
  isDeleting,
  onDelete,
}: CustomerTableProps) {
  const isEmpty = !customers || customers.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>নাম</TableHead>
            <TableHead>সিরিয়াল</TableHead>
            <TableHead className='text-right'>অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={3} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <UserX className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">কোনো গ্রাহক পাওয়া যায়নি।</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <CustomerTableRow
                key={customer.id}
                {...customer}
                isAdmin={isAdmin}
                isDeleting={isDeleting}
                onUpdate={() => (window.location.href = `/customers/${customer.id}/update`)}
                onDelete={() => onDelete(customer.id)}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
