// src/modules/installment/components/installment-manager.tsx
import { Button } from '@/components/ui/button'
import ErrorAlert from '@/components/ui/error-alert'
import { Plus, ChevronRight, Package } from 'lucide-react'
import { actions } from 'astro:actions'
import { useAction } from '@/hooks/use-action'
import InstallmentTable from './installment-table'
import type { PublicInstallment } from '../installment-types'

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
  return `৳${amount.toLocaleString('bn-BD')}`;
}

export function InstallmentManager({
  productId,
  productName,
  customerId,
  customerName,
  isAdmin,
  errorMsg,
  installments,
  balance,
}: InstallmentManagerProps) {
  const { execute: executeDelete, isLoading: isDeleting } = useAction(
    actions.installment.deleteInstallment,
    {
      loadingMessage: 'মুছে ফেলা হচ্ছে...',
      successMessage: 'কিস্তি মুছে ফেলা হয়েছে!',
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  const handleDelete = (id: string) => {
    executeDelete({ id });
  };

  const handleUpdate = (id: string) => {
    window.location.href = `/customers/${customerId}/products/${productId}/installments/${id}/edit`;
  };

  return (
    <div className='space-y-6'>
      <ErrorAlert errorMsg={errorMsg} />

      <nav className='flex items-center gap-2 text-xs text-zinc-400'>
        <a href="/customers" className='hover:text-white transition-colors'>
          গ্রাহক তালিকা (Customers)
        </a>
        <ChevronRight className='w-3 h-3' />
        <a href={`/customers/${customerId}/products`} className='hover:text-white transition-colors'>
          {customerName}
        </a>
        <ChevronRight className='w-3 h-3' />
        <span className='text-zinc-200 font-medium'>{productName}</span>
      </nav>

      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0'>
            <Package className='w-6 h-6 text-zinc-300' />
          </div>

          <div>
            <h1 className='text-xl font-bold text-white'>{productName}</h1>
            <p className='text-xs text-zinc-400 mt-1'>
              কিস্তি ব্যবস্থাপনা (Installment Management)
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          {/* Button to go to the Fines page */}
          <Button asChild variant="outline">
            <a href={`/customers/${customerId}/products/${productId}/fines`}>
              জরিমানা দেখুন (View Fines)
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

      {/* 5 cards now — totalFines only shows a non-zero highlight when
          there actually are fines, so products with no fines look the
          same as before. */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-zinc-900/50 border border-zinc-800 rounded-xl p-4'>
          <p className='text-xs text-zinc-400'>মোট মূল্য</p>
          <p className='text-lg font-semibold text-white'>{formatBDT(balance.totalPrice)}</p>
        </div>
        <div className='bg-zinc-900/50 border border-zinc-800 rounded-xl p-4'>
          <p className='text-xs text-zinc-400'>পরিশোধিত</p>
          <p className='text-lg font-semibold text-white'>
            {formatBDT(balance.downPayment + balance.totalPaid)}
          </p>
        </div>
        <div className={`rounded-xl p-4 border ${balance.totalFines > 0 ? 'bg-red-950/30 border-red-900/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
          <p className='text-xs text-zinc-400'>জরিমানা</p>
          <p className={`text-lg font-semibold ${balance.totalFines > 0 ? 'text-red-400' : 'text-white'}`}>
            {formatBDT(balance.totalFines)}
          </p>
        </div>
        <div className='bg-zinc-900/50 border border-zinc-800 rounded-xl p-4'>
          <p className='text-xs text-zinc-400'>বাকি</p>
          <p className='text-lg font-semibold text-white'>{formatBDT(balance.remaining)}</p>
        </div>
        <div className='bg-zinc-900/50 border border-zinc-800 rounded-xl p-4'>
          <p className='text-xs text-zinc-400'>অবস্থা</p>
          <p className='text-lg font-semibold text-white'>
            {balance.isFullyPaid ? 'সম্পূর্ণ পরিশোধিত' : 'চলমান'}
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