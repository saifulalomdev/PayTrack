import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { PublicInstallment } from '../installment.types';
import { actions } from 'astro:actions';
import { Plus } from 'lucide-react';
import InstallmentCard from './card';

interface InstallmentManagerProps {
  customerId: string;
  errorMsg?: string;
  installments?: PublicInstallment[] | null;
  // Same convention as CustomerManager — the page passes down what it
  // already knows from the session; this component just renders it.
  isAdmin?: boolean;
}

export function InstallmentManager({ customerId, errorMsg, installments = [], isAdmin = false }: InstallmentManagerProps) {
  const isEmpty = !installments || installments.length === 0;

  const { isLoading, execute } = useAction(actions.installment.deleteInstallment, {
    onSuccess: () => {
      window.location.reload()
    }
  })

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={errorMsg} />

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
            isDeleting={isLoading}
            onUpdate={() => window.location.href = `/customers/${customerId}/installments/${installment.id}/edit`}
            onDelete={() => execute({ id: installment.id })}
          />
        )}
      </div>
    </div>
  );
}