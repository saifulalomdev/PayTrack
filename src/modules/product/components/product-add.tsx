import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { insertProductSchema } from '../product-schema';
import { actions } from 'astro:actions';
import ProductForm from './product-form';

interface ProductAddProps {
    customerId: string;
}

export function ProductAdd({ customerId }: ProductAddProps) {
    const { form, onSubmit, isLoading } = useFormAction({
        actionFn: actions.product.createProduct,
        defaultValues: {
            customerId: customerId,
            productName: '',
            totalPrice: undefined,
            downPayment: 0,
            installmentAmount: undefined,
            installmentDeadline: undefined,
            createdByName: '',
        },
        schema: insertProductSchema,
        loadingMessage: "Saving product...",
        successMessage: "Product added successfully!",
        onSuccess: () => {
            window.location.href = `/customers/${customerId}/products`;
        }
    });

    return (
        <div className='space-y-4'>
            <PageHeader title='নতুন পণ্য যোগ করুন' />
            <ProductForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                customerId={customerId}
            />
        </div>
    );
}