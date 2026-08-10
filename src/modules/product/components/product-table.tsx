// src/modules/product/components/product-table.tsx
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
import { PackageX, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { PublicProduct } from '../product-types';

interface ProductTableProps {
  products: PublicProduct[];
  isDeleting: boolean;
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

export default function ProductTable({
  products,
  isDeleting,
  onUpdate,
  onDelete,
}: ProductTableProps) {
  const isEmpty = !products || products.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>পণ্যের নাম</TableHead>
            <TableHead>মোট মূল্য</TableHead>
            <TableHead>ডাউন পেমেন্ট</TableHead>
            <TableHead>কিস্তির পরিমাণ</TableHead>
            <TableHead>কিস্তির শেষ তারিখ</TableHead>
            <TableHead>যোগ করেছেন</TableHead>
            <TableHead className='text-right'>অ্যাকশন</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={7} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <PackageX className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">কোনো পণ্য পাওয়া যায়নি।</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.productName}</TableCell>
                <TableCell>{formatBDT(product.totalPrice)}</TableCell>
                <TableCell>{formatBDT(product.downPayment)}</TableCell>
                <TableCell>{formatBDT(product.installmentAmount)}</TableCell>
                <TableCell>{formatDate(product.installmentDeadline)}</TableCell>
                <TableCell className="text-muted-foreground">{product.createdByName}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isDeleting}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onUpdate(product.id)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        সম্পাদনা করুন
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        মুছে ফেলুন
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}