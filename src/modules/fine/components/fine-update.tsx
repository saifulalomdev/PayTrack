// src/modules/fine/components/fine-update.tsx

import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateFineSchema } from '../fine-schema';
import type { UpdateFine } from '../fine-types';
import { actions } from 'astro:actions';
import { FineForm } from './fine-form';
import ErrorAlert from '@/components/ui/error-alert';

export function FineUpdate({ fineData, customerId, productId, errorMsg }: { fineData: UpdateFine, customerId: string, productId: string, errorMsg?: string }) {

    const { form, onSubmit, isLoading } = useFormAction<UpdateFine, any>({
        actionFn: actions.fine.updateFine,
        defaultValues: fineData,
        schema: updateFineSchema,
        loadingMessage: "Updating fine...",
        successMessage: "Fine updated successfully!",
        onSuccess: () => {
            window.location.href = `/customers/${customerId}/products/${productId}/installments`
        }
    });

    return (
        <div className='space-y-4'>
            <ErrorAlert errorMsg={errorMsg} />
            <PageHeader title='Update Fine Information' />
            <FineForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                cancelHref={`/customers/${customerId}/products/${productId}/fines`}
            />
        </div>
    );
}