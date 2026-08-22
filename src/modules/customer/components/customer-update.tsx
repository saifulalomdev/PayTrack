// src/modules/customer/components/customer-update.tsx

import { PageHeader } from '@/components/ui/page-header';
import { useFormAction } from '@/hooks/use-form-action';
import { updateCustomerSchema } from '../customer-schema';
import type { UpdateCustomer } from '../customer-types';
import { actions } from 'astro:actions';
import { CustomerForm } from './customer-form';
import ErrorAlert from '@/components/ui/error-alert';

export function UpdateCustomer({ customerData, errorMsg }: { customerData: UpdateCustomer; errorMsg?: string }) {
  const { form, onSubmit, isLoading } = useFormAction<UpdateCustomer, any>({
    actionFn: actions.customer.updateCustomer,
    defaultValues: customerData,
    schema: updateCustomerSchema,
    loadingMessage: "Updating customer information...",
    successMessage: "Customer information updated successfully!",
    onSuccess: () => {
      window.location.href = "/customers";
    }
  });

  return (
    <div className='space-y-4'>
      <ErrorAlert errorMsg={errorMsg} />
      <PageHeader title='Edit Customer Information' />
      <CustomerForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}