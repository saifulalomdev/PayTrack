import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateInstallmentSchema } from '../installment.schema';
import { UpdateInstallment } from '../installment.types';
import { actions } from 'astro:actions';
import { InstallmentForm } from './form';
import ErrorAlert from '@/components/ui/error-alert';

// Admin only. The route rendering this component must guard access with
// requireAdmin server-side before reaching this point — the
// updateInstallment action also enforces requireAdmin itself, so this is
// defense in depth, not the only gate.
export function EditInstallment({ installmentData, errorMsg }: { installmentData: UpdateInstallment, errorMsg?: string }) {

    const { form, onSubmit, isLoading } = useFormAction<UpdateInstallment, any>({
        actionFn: actions.installment.updateInstallment,
        defaultValues: installmentData,
        schema: updateInstallmentSchema,
        loadingMessage: "কিস্তির তথ্য আপডেট হচ্ছে...",
        successMessage: "কিস্তির তথ্য সফলভাবে আপডেট হয়েছে!",
    });

    const backHref = installmentData.customerId
        ? `/customers/${installmentData.customerId}/installments`
        : "/customers";

    return (
        <div className='space-y-4'>
            <ErrorAlert errorMsg={errorMsg} />
            <PageHeader title='কিস্তির তথ্য আপডেট করুন' />
            <InstallmentForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                backHref={backHref}
            />
        </div>
    );
}