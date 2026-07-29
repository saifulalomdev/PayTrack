import { Button } from '@/components/ui/button';
import ErrorAlert from '@/components/ui/error-alert';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { Plus } from 'lucide-react';
import StaffEmptyState from './staff-empty-state';


interface StaffManagerProps {
  errorMsg?: string
}

export function StaffManager({ errorMsg }: StaffManagerProps) {
  

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={errorMsg} />

      <PageHeader title='Staff Management'>
        <a href="/staff/new">
          <Button
            className='uppercase w-full'
            variant="default"
          >
            <Plus className="w-4 h-4" /> Add a new staff
          </Button></a>
      </PageHeader>

      <Input placeholder='Find staff...' />

      <StaffEmptyState/>
    </div>
  );
}