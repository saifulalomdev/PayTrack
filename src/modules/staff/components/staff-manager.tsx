import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import StaffEmptyState from './staff-empty-state';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { PublicStaff } from '../staff.types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import StaffCard from './card';

interface StaffManagerProps {
  errorMsg?: string;
  staff?: PublicStaff[] | null;
}

export function StaffManager({ errorMsg, staff = [] }: StaffManagerProps) {
  const isEmpty = !staff || staff.length === 0;

  const { isLoading, execute } = useAction(actions.staff.deleteStaff, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={errorMsg} />

      <PageHeader title='Staff Management'>
        <Button asChild className='uppercase w-full md:w-auto'>
          <a href="/staff/new">
            <Plus className="w-4 h-4 mr-2" /> Add a new staff
          </a>
        </Button>
      </PageHeader>

      {!errorMsg && isEmpty && <StaffEmptyState />}

      <div className='space-y-4'>
        {!errorMsg && !isEmpty && staff.map(staff =>
          <StaffCard
            key={staff.id}
            {...staff}
            isDeleting={isLoading}
            onUpdate={() => window.location.href = `/staff/${staff.id}/edit`}
            onDelete={() => execute({ id: staff.id })}
          />
        )}
      </div>
    </div>
  );
}