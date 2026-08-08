import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import StaffEmptyState from './staff-empty-state';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import type { PublicStaff } from '../staff-types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import StaffTableRow from './staff-table-row';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StaffManagerProps {
  errorMsg?: string;
  staff?: PublicStaff[] | null;
}

export function StaffManager({ errorMsg, staff = [] }: StaffManagerProps) {
  const isEmpty = !staff || staff.length === 0;

  const { isLoading, execute } = useAction(actions.staff.deleteStaff, {
    onSuccess: () => {
      window.location.reload();
    },
  });

  return (
    <div className="space-y-8">
      <ErrorAlert errorMsg={errorMsg} />

      <PageHeader title="Staff Management">
        <Button asChild className="uppercase w-full md:w-auto">
          <a href="/staff/new">
            <Plus className="w-4 h-4 mr-2" /> Add a new staff
          </a>
        </Button>
      </PageHeader>

      {!errorMsg && isEmpty && <StaffEmptyState />}

      {!errorMsg && !isEmpty && (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow className='bg-muted'>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right border-r">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <StaffTableRow
                  key={member.id}
                  {...member}
                  isDeleting={isLoading}
                  onUpdate={() => (window.location.href = `/staff/${member.id}/update`)}
                  onDelete={() => execute({ id: member.id })}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}