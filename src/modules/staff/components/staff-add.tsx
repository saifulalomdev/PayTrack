// src/modules/staff/components/staff-add.tsx

import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { insertStaffSchema } from '../staff-schema';
import { actions } from 'astro:actions';
import { StaffForm } from './staff-form';


export function StaffAdd() {
    const { form, onSubmit, isLoading } = useFormAction({
        actionFn: actions.staff.createStaff,
        defaultValues: {
            name: '',
            phoneNumber: '',
            role: 'staff',
            password: ''
        },
        schema: insertStaffSchema,
        loadingMessage: "Saving staff...",
        successMessage: "Staff created successfully!",
        onSuccess: ()=> {
            window.location.href = "/staff"
        }
    });

    return (
        <div className='space-y-4'>
            <PageHeader title='Add a new staff' />
            <StaffForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
            />
        </div>
    )
}
