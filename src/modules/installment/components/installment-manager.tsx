// src/modules/installment/components/installment-manager.tsx
import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Plus, ChevronRight, Package } from 'lucide-react';
import { actions } from 'astro:actions';
import { useAction } from '@/hooks/use-action';
import InstallmentTable from './installment-table';
import type { PublicInstallment } from '../installment-types';

interface InstallmentBalance {
  totalPrice: number;
  downPayment: number;
  totalFines: number;
  totalPaid: number;
  owed: number;
  remaining: number;
  isFullyPaid: boolean;
}

interface InstallmentManagerProps {
  productId: string;
  productName?: string;
  customerId: string;
  customerName?: string;
  isAdmin: boolean;
  errorMsg?: string;
  installments: PublicInstallment[];
  balance: InstallmentBalance;
}

function formatBDT(amount: number) {
  return `৳${amount.toLocaleString('en-US')}`;
}

export function InstallmentManager({
  productId,
  productName = 'Product',
  customerId,
  customerName = 'Customer',
  isAdmin,
  errorMsg,
  installments,
  balance,
}: InstallmentManagerProps) {
  const { execute: executeDelete, isLoading: isDeleting } = useAction(
    actions.installment.deleteInstallment,
    {
      loadingMessage: 'Deleting installment...',
      successMessage: 'Installment deleted successfully!',
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this installment record?')) {
      executeDelete({ id });
    }
  };

  const handleUpdate = (id: string) => {
    window.location.href = `/customers/${customerId}/products/${productId}/installments/${id}/update`;
  };

  return (
    <div className='space-y-6'>
      <ErrorAlert errorMsg={errorMsg} />

      {/* Navigation Breadcrumb */}
      <nav className='flex items-center gap-2 text-xs text-muted-foreground'>
        <a href="/customers" className='hover:text-foreground transition-colors'>
          Customers
        </a>
        <ChevronRight className='w-3 h-3' />
        <a href={`/customers/${customerId}/products`} className='hover:text-foreground transition-colors'>
          {customerName}
        </a>
        <ChevronRight className='w-3 h-3' />
        <span className='text-foreground font-medium'>{productName}</span>
      </nav>

      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-xl p-5'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-muted border flex items-center justify-center shrink-0'>
            <Package className='w-6 h-6 text-muted-foreground' />
          </div>

          <div>
            <h1 className='text-xl font-bold'>{productName}</h1>
            <p className='text-xs text-muted-foreground mt-1'>
              Installment Management
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button asChild variant="outline">
            <a href={`/customers/${customerId}/products/${productId}/fines`}>
              View Fines
            </a>
          </Button>

          {!balance.isFullyPaid && (
            <Button asChild className='uppercase shrink-0'>
              <a href={`/customers/${customerId}/products/${productId}/installments/new`}>
                <Plus className="w-4 h-4 mr-2" /> Add New Installment
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-card border rounded-xl p-4'>
          <p className='text-xs text-muted-foreground'>Total Price</p>
          <p className='text-lg font-semibold'>{formatBDT(balance.totalPrice)}</p>
        </div>
        <div className='bg-card border rounded-xl p-4'>
          <p className='text-xs text-muted-foreground'>Total Paid</p>
          <p className='text-lg font-semibold'>
            {formatBDT(balance.downPayment + balance.totalPaid)}
          </p>
        </div>
        <div className={`rounded-xl p-4 border ${balance.totalFines > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-card'}`}>
          <p className='text-xs text-muted-foreground'>Total Fines</p>
          <p className={`text-lg font-semibold ${balance.totalFines > 0 ? 'text-destructive' : ''}`}>
            {formatBDT(balance.totalFines)}
          </p>
        </div>
        <div className='bg-card border rounded-xl p-4'>
          <p className='text-xs text-muted-foreground'>Remaining</p>
          <p className='text-lg font-semibold'>{formatBDT(balance.remaining)}</p>
        </div>
        <div className='bg-card border rounded-xl p-4'>
          <p className='text-xs text-muted-foreground'>Status</p>
          <p className='text-lg font-semibold'>
            {balance.isFullyPaid ? 'Fully Paid' : 'Active'}
          </p>
        </div>
      </div>

      <InstallmentTable
        installments={installments}
        isDeleting={isDeleting}
        canManage={isAdmin}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}