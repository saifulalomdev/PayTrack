// src/modules/fine/components/fine-manager.tsx
import { Button } from '@/components/ui/button'
import ErrorAlert from '@/components/ui/error-alert'
import { Plus, ChevronRight, Package } from 'lucide-react'
import { actions } from 'astro:actions'
import { useAction } from '@/hooks/use-action'
import FineTable from './fine-table'
import type { PublicFine } from '../fine-types'

interface FineManagerProps {
  customerId: string;
  productId: string;
  customerName?: string;
  productName?: string;
  errorMsg?: string;
  fines: PublicFine[];
  isAdmin?: boolean;
}

export function FineManager({
  customerId,
  productId,
  customerName = 'Customer',
  productName = 'Product',
  errorMsg,
  fines,
  isAdmin = false,
}: FineManagerProps) {
  const { execute: executeDelete, isLoading: isDeleting } = useAction(
    actions.fine.deleteFine,
    {
      loadingMessage: 'Deleting fine...',
      successMessage: 'Fine deleted successfully!',
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this fine?')) {
      executeDelete({ id });
    }
  };

  const handleUpdate = (id: string) => {
    window.location.href = `/customers/${customerId}/products/${productId}/fines/${id}/update`;
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
        <span className='text-foreground font-medium'>Fines</span>
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
              Fine Management
            </p>
          </div>
        </div>

        <Button asChild className='uppercase shrink-0'>
          <a href={`/customers/${customerId}/products/${productId}/fines/new`}>
            <Plus className="w-4 h-4 mr-2" /> Add New Fine
          </a>
        </Button>
      </div>

      {/* Fine Table */}
      <FineTable
        fines={fines}
        isDeleting={isDeleting}
        isAdmin={isAdmin}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  )
}