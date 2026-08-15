// add-new-customer.tsx
import { useFormAction } from '@/hooks/use-form-action';
import { actions } from 'astro:actions';
import { insertCustomerSchema } from '../customer-schema';
import { CustomerForm } from './customer-form';
import { PageHeader } from '@/components/ui/page-header';

export function AddNewCustomer() {
    const { form, onSubmit, isLoading } = useFormAction({
        actionFn: actions.customer.createCustomer,
        defaultValues: {
            serialNumber: '',
            name: '',
            guardianName: '',
            guardianType: 'father',
            phoneNumber: '',
            address: '',
        },
        schema: insertCustomerSchema,
        loadingMessage: "গ্রাহক সংরক্ষণ হচ্ছে...",
        successMessage: "গ্রাহক সফলভাবে তৈরি করা হয়েছে!",
        onSuccess: () => {
            window.location.href = "/customers"
        }
    });

    return (
        <div className='space-y-4'>
            <PageHeader title='নতুন গ্রাহক যোগ করুন' />
            <CustomerForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    )
}