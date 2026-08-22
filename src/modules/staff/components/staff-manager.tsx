// src/modules/staff/components/staff-manager.tsx

import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import type { PublicStaff } from '../staff-types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import { StaffTable } from './staff-table';

interface StaffManagerProps {
  errorMsg?: string;
  staff?: PublicStaff[] | null;
}

export function StaffManager({ errorMsg, staff }: StaffManagerProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { execute } = useAction(actions.staff.deleteStaff, {
    onSuccess: () => {
      setDeletingId(null);
      window.location.reload();
    },
    onError: () => {
      setDeletingId(null);
    }
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    execute({ id });
  };

  const handleUpdate = (id: string) => {
    window.location.href = `/staff/${id}/update`;
  };

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

      {!errorMsg && (
        <StaffTable
          staff={staff}
          deletingId={deletingId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}