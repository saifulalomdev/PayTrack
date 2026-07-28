import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import StaffEmptyState from './staff-empty-state';
import { useFormAction } from '@/hooks/use-form-action';
import { actions } from 'astro:actions';
import { insertStaffSchema } from '../staff.schema';
import { useState } from 'react';
import { StaffFormDialog } from './form';

export function StaffManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    onSuccess: (data) => {
      setIsDialogOpen(false);
    }
  });

  return (
    <div className='space-y-8'>
      {/* <ErrorAlert errorMsg={"Something went wrong"} /> */}

      <PageHeader title='Staff Management'>
        <Button
          className='uppercase w-full'
          variant="default"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4" /> Add a new staff
        </Button>
      </PageHeader>

      <Input placeholder='Find staff...' />

      <StaffEmptyState onAddStaff={() => setIsDialogOpen(true)} />

      <StaffFormDialog
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </div>
  );
}