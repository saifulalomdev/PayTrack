// src/modules/fine/components/fine-add.tsx

import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { insertFineSchema } from '../fine-schema';
import { actions } from 'astro:actions';
import { FineForm } from './fine-form';

// productId comes from the page route param (/customers/[id]/products/[productId]/fines/new),
// not from a form field — it's merged into the submitted payload here rather
// than typed by the client. customerId is only used to build the redirect.
export function FineAdd({ customerId, productId }: { customerId: string; productId: string }) {
    const { form, onSubmit, isLoading } = useFormAction({
        actionFn: actions.fine.createFine,
        defaultValues: {
            amount: 0,
            note: '',
        },
        schema: insertFineSchema,
        loadingMessage: "Saving fine...",
        successMessage: "Fine created successfully!",
        onSuccess: () => {
            window.location.href = `/customers/${customerId}/products/${productId}/fines`
        }
    });

    const onSubmitWithProductId = (data: any) => onSubmit({ ...data, productId });

    return (
        <div className='space-y-4'>
            <PageHeader title='Add a new fine' />
            <FineForm
                form={form}
                onSubmit={onSubmitWithProductId}
                isLoading={isLoading}
                cancelHref={`/customers/${customerId}/products/${productId}/fines`}
            />
        </div>
    )
}