// src/modules/product/components/product-update.tsx
import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateProductSchema } from '../product-schema';
import type { UpdateProduct } from '../product-types';
import ErrorAlert from '@/components/ui/error-alert';
import ProductForm from './product-form';
import { actions } from 'astro:actions';

interface ProductUpdateProps {
    customerId: string;
    productData: UpdateProduct;
    errorMsg?: string;
}

export function ProductUpdate({ customerId, productData, errorMsg }: ProductUpdateProps) {
    const { form, onSubmit, isLoading } = useFormAction<UpdateProduct, any>({
        actionFn: actions.product.updateProduct,
        defaultValues: productData,
        schema: updateProductSchema,
        loadingMessage: "পণ্যের তথ্য আপডেট হচ্ছে...",
        successMessage: "পণ্যের তথ্য সফলভাবে আপডেট হয়েছে!",
        onSuccess: () => {
            window.location.href = `/customers/${customerId}/products`;
        },
    });

    return (
        <div className='space-y-4'>
            <ErrorAlert errorMsg={errorMsg} />
            <PageHeader title='পণ্যের তথ্য আপডেট করুন' />
            <ProductForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                customerId={customerId}
            />
        </div>
    );
}