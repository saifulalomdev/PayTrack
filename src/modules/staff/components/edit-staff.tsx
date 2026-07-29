import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateStaffSchema } from '../staff.schema';
import { UpdateStaff } from '../staff.types';
import { actions } from 'astro:actions';
import { StaffForm } from './form';

export function EditStaff({ staffData }: { staffData: UpdateStaff }) {

    const { form, onSubmit, isLoading } = useFormAction<UpdateStaff, any>({
        actionFn: actions.staff.updateStaff,
        defaultValues: staffData,
        schema: updateStaffSchema,
        loadingMessage: "Updating staff...",
        successMessage: "Staff updated successfully!",
    });

    return (
        <div className='space-y-4'>
            <PageHeader title='Update Staff Information' />
            <StaffForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}