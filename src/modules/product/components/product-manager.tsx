//src/modules/product/components/product-manager.tsx
import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Plus, ChevronRight, User } from 'lucide-react';
import { actions } from 'astro:actions';
import { useAction } from '@/hooks/use-action';
import ProductTable from './product-table';
import type { PublicProduct } from '../product-types';

interface ProductManagerProps {
  customerId: string;
  customerName?: string;
  serialNumber?: string;
  errorMsg?: string;
  products: PublicProduct[];
}

export function ProductManager({
  customerId,
  customerName = 'Customer',
  serialNumber,
  errorMsg,
  products,
}: ProductManagerProps) {
  const { execute: executeDelete, isLoading: isDeleting } = useAction(
    actions.product.deleteProduct,
    {
      loadingMessage: 'Deleting product...',
      successMessage: 'Product deleted successfully!',
      onSuccess: () => {
        window.location.reload();
      },
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      executeDelete({ id });
    }
  };

  const handleUpdate = (id: string) => {
    window.location.href = `/customers/${customerId}/products/${id}/update`;
  };

  const handleViewInstallments = (id: string) => {
    window.location.href = `/customers/${customerId}/products/${id}/installments`;
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
        <span className='text-foreground font-medium'>{customerName}</span>
      </nav>

      {/* Header Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border rounded-xl p-5'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-full bg-muted border flex items-center justify-center shrink-0'>
            <User className='w-6 h-6 text-muted-foreground' />
          </div>

          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-xl font-bold'>{customerName}</h1>
              {serialNumber && (
                <span className='px-2 py-0.5 text-xs bg-muted border text-muted-foreground rounded-md font-mono'>
                  #{serialNumber}
                </span>
              )}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              Product Management
            </p>
          </div>
        </div>

        <Button asChild className='uppercase shrink-0'>
          <a href={`/customers/${customerId}/products/new`}>
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </a>
        </Button>
      </div>

      <ProductTable
        products={products}
        isDeleting={isDeleting}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onViewInstallments={handleViewInstallments}
      />
    </div>
  );
}