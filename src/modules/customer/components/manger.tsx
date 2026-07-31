import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { PublicCustomer } from '../customer.types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import CustomerCard from './card';
import CustomerEmptyState from './empty-state';

interface CustomerManagerProps {
  errorMsg?: string;
  customers?: PublicCustomer[] | null;
  // Passed down from the page/layout, which already knows the logged-in
  // staff's role from the session. This component doesn't decide who's an
  // admin — it only renders what it's told, defaulting to false so
  // edit/delete controls fail safe (hidden) if this is ever omitted.
  isAdmin?: boolean;
}

export function CustomerManager({ errorMsg, customers = [], isAdmin = false }: CustomerManagerProps) {
  const isEmpty = !customers || customers.length === 0;

  const { isLoading, execute } = useAction(actions.customer.deleteCustomer, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={errorMsg} />

      <PageHeader title='গ্রাহক ব্যবস্থাপনা'>
        <Button asChild className='uppercase w-full md:w-auto'>
          <a href="/customers/new">
            <Plus className="w-4 h-4 mr-2" /> নতুন গ্রাহক যোগ করুন
          </a>
        </Button>
      </PageHeader>

      {!errorMsg && isEmpty && <CustomerEmptyState />}

      <div className='space-y-4'>
        {!errorMsg && !isEmpty && customers.map(customer =>
          <CustomerCard
            key={customer.id}
            {...customer}
            isAdmin={isAdmin}
            isDeleting={isLoading}
            onUpdate={() => window.location.href = `/customers/${customer.id}/edit`}
            onDelete={() => execute({ id: customer.id })}
          />
        )}
      </div>
    </div>
  );
}