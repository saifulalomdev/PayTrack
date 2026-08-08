import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import type { PublicInstallment } from '../installment.types';
import type { PublicCustomer } from '@/modules/customer/customer.types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import InstallmentCard from './card';
import { CustomerDetailsCard } from '@/modules/customer/components/customer-details-card';

interface InstallmentManagerProps {
  customerId: string;
  // The customer this page is showing installments for — this page IS
  // that customer's detail view, since CustomerCard on /customers links
  // straight here now. Nullable because the fetch can fail/miss.
  customer?: PublicCustomer | null;
  errorMsg?: string;
  installments?: PublicInstallment[] | null;
  // Same convention as CustomerManager — the page passes down what it
  // already knows from the session; this component just renders it.
  isAdmin?: boolean;
}

export function InstallmentManager({ customerId, customer, errorMsg, installments = [], isAdmin = false }: InstallmentManagerProps) {
  const isEmpty = !installments || installments.length === 0;

  // Deleting the CUSTOMER (admin only) — separate action/loading state
  // from deleting an individual INSTALLMENT below, since they're
  // different entities with different effects (deleting the customer
  // cascades and removes every installment too, then leaves this page).
  const { isLoading: isDeletingCustomer, execute: executeDeleteCustomer } = useAction(actions.customer.deleteCustomer, {
    onSuccess: () => {
      window.location.href = "/customers";
    }
  });

  const { isLoading: isDeletingInstallment, execute: executeDeleteInstallment } = useAction(actions.installment.deleteInstallment, {
    onSuccess: () => {
      window.location.reload();
    }
  });

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={errorMsg} />

      {/* Customer's own details — edit/delete only rendered for admins,
          same isAdmin gate as everywhere else. */}
      {!errorMsg && customer && (
        <CustomerDetailsCard
          {...customer}
          isAdmin={isAdmin}
          isDeleting={isDeletingCustomer}
          onUpdate={() => window.location.href = `/customers/${customerId}/edit`}
          onDelete={() => executeDeleteCustomer({ id: customerId })}
        />
      )}

      <PageHeader title='কিস্তির তালিকা'>
        <Button asChild className='uppercase w-full md:w-auto'>
          <a href={`/customers/${customerId}/installments/new`}>
            <Plus className="w-4 h-4 mr-2" /> নতুন কিস্তি যোগ করুন
          </a>
        </Button>
      </PageHeader>

      {!errorMsg && isEmpty && (
        <p className="text-sm text-muted-foreground">
          এই গ্রাহকের জন্য এখনো কোনো কিস্তি যোগ করা হয়নি।
        </p>
      )}

      <div className='space-y-4'>
        {!errorMsg && !isEmpty && installments.map(installment =>
          <InstallmentCard
            key={installment.id}
            {...installment}
            isAdmin={isAdmin}
            isDeleting={isDeletingInstallment}
            onUpdate={() => window.location.href = `/customers/${customerId}/installments/${installment.id}/edit`}
            onDelete={() => executeDeleteInstallment({ id: installment.id })}
          />
        )}
      </div>
    </div>
  );
}