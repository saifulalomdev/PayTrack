import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateCustomerSchema } from '../customer-schema';
import type { UpdateCustomer } from '../customer-types';
import { actions } from 'astro:actions';
import { CustomerForm } from './customer-form';
import ErrorAlert from '@/components/ui/error-alert';

// Admin only. The route rendering this component must guard access with
// requireAdmin server-side before reaching this point — the
// customer.actions.ts updateCustomer action also enforces requireAdmin
// itself, so this is defense in depth, not the only gate.
export function EditCustomer({ customerData, errorMsg }: { customerData: UpdateCustomer, errorMsg?: string }) {

    const { form, onSubmit, isLoading } = useFormAction<UpdateCustomer, any>({
        actionFn: actions.customer.updateCustomer,
        defaultValues: customerData,
        schema: updateCustomerSchema,
        loadingMessage: "গ্রাহক তথ্য আপডেট হচ্ছে...",
        successMessage: "গ্রাহক তথ্য সফলভাবে আপডেট হয়েছে!",
    });

    return (
        <div className='space-y-4'>
            <ErrorAlert errorMsg={errorMsg} />
            <PageHeader title='গ্রাহকের তথ্য আপডেট করুন' />
            <CustomerForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}