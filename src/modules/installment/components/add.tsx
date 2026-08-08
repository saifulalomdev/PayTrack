import { useFormAction } from '@/hooks/use-form-action';
import { actions } from 'astro:actions';
import { insertInstallmentSchema } from '../installment.schema';
import { InstallmentForm } from './form';
import { PageHeader } from '@/components/ui/page-header';

interface AddNewInstallmentProps {
    // Which customer this payment is being logged against — comes from the
    // route (/customers/[id]/installments/new), never typed by the user.
    customerId: string;
}

export function AddNewInstallment({ customerId }: AddNewInstallmentProps) {
    const { form, onSubmit, isLoading } = useFormAction({
        actionFn: actions.installment.createInstallment,
        defaultValues: {
            customerId,
            amount: undefined,
            note: '',
        },
        schema: insertInstallmentSchema,
        loadingMessage: "কিস্তি সংরক্ষণ হচ্ছে...",
        successMessage: "কিস্তি সফলভাবে যোগ করা হয়েছে!",
        onSuccess: () => {
            window.location.href = `/customers/${customerId}/installments`
        }
    });

    return (
        <div className='space-y-4'>
            <PageHeader title='নতুন কিস্তি যোগ করুন' />
            <InstallmentForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                backHref={`/customers/${customerId}/installments`}
            />
        </div>
    )
}