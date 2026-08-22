// src/modules/product/components/product-update.tsx
import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateProductSchema } from '../product-schema';
import type { PublicProduct } from '../product-types';
import ErrorAlert from '@/components/ui/error-alert';
import ProductForm from './product-form';
import { actions } from 'astro:actions';

interface ProductUpdateProps {
  customerId: string;
  productData: PublicProduct;
  errorMsg?: string;
}

export function ProductUpdate({ customerId, productData, errorMsg }: ProductUpdateProps) {
  const { form, onSubmit, isLoading } = useFormAction({
    actionFn: actions.product.updateProduct,
    defaultValues: {
      id: productData.id,
      customerId: productData.customerId,
      productName: productData.productName,
      totalPrice: productData.totalPrice,
      downPayment: productData.downPayment,
      installmentAmount: productData.installmentAmount,
      installmentDeadline: productData.installmentDeadline,
      createdByName: productData.createdByName ?? undefined,
    },
    schema: updateProductSchema,
    loadingMessage: "Updating product...",
    successMessage: "Product updated successfully!",
    onSuccess: () => {
      window.location.href = `/customers/${customerId}/products`;
    },
  });

  return (
    <div className='space-y-4'>
      <ErrorAlert errorMsg={errorMsg} />
      <PageHeader title='Update Product' />
      <ProductForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        customerId={customerId}
      />
    </div>
  );
}