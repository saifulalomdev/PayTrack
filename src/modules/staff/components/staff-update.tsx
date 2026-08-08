import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateStaffSchema } from '../staff-schema';
import type { UpdateStaff } from '../staff-types';
import { actions } from 'astro:actions';
import { StaffForm } from './staff-form';
import ErrorAlert from '@/components/ui/error-alert';

export function StaffUpdate({ staffData , errorMsg}: { staffData: UpdateStaff, errorMsg?: string}) {

    const { form, onSubmit, isLoading } = useFormAction<UpdateStaff, any>({
        actionFn: actions.staff.updateStaff,
        defaultValues: staffData,
        schema: updateStaffSchema,
        loadingMessage: "Updating staff...",
        successMessage: "Staff updated successfully!",
    });

    return (
        <div className='space-y-4'>
            <ErrorAlert errorMsg={errorMsg}/>
            <PageHeader title='Update Staff Information' />
            <StaffForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}