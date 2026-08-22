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
import { PackageX, MoreHorizontal, Pencil, Trash2, Receipt } from 'lucide-react';
import type { PublicProduct } from '../product-types';

interface ProductTableProps {
  products: PublicProduct[];
  isDeleting: boolean;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
  onViewInstallments: (id: string) => void;
}

function formatBDT(amount?: number | null) {
  if (amount === undefined || amount === null) return '—';
  return `৳${amount.toLocaleString('en-US')}`;
}

function formatDate(unix?: number | null) {
  if (!unix) return '—';
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function ProductTable({
  products,
  isDeleting,
  onUpdate,
  onDelete,
  onViewInstallments,
}: ProductTableProps) {
  const isEmpty = !products || products.length === 0;

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Down Payment</TableHead>
            <TableHead>Installment Amount</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={7} className="h-48 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <PackageX className="w-8 h-8 opacity-60" />
                  <p className="text-sm font-medium">No products found.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <button
                    type="button"
                    onClick={() => onViewInstallments(product.id)}
                    className="hover:underline hover:text-primary text-left transition-colors"
                  >
                    {product.productName}
                  </button>
                </TableCell>
                <TableCell>{formatBDT(product.totalPrice)}</TableCell>
                <TableCell>{formatBDT(product.downPayment)}</TableCell>
                <TableCell>{formatBDT(product.installmentAmount)}</TableCell>
                <TableCell>{formatDate(product.installmentDeadline)}</TableCell>
                <TableCell className="text-muted-foreground">{product.createdByName}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs" className='rounded-full' disabled={isDeleting}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewInstallments(product.id)}>
                        <Receipt className="w-4 h-4 mr-2" />
                        View Installments
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onUpdate(product.id)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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