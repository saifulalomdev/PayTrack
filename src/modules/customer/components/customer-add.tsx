// src/modules/customer/components/customer-add.tsx

import { useFormAction } from '@/hooks/use-form-action';
import { actions } from 'astro:actions';
import { insertCustomerSchema } from '../customer-schema';
import { CustomerForm } from './customer-form';
import { PageHeader } from '@/components/ui/page-header';

export function AddCustomer() {
  const { form, onSubmit, isLoading } = useFormAction({
    actionFn: actions.customer.createCustomer,
    defaultValues: {
      serialNumber: '',
      name: '',
      guardianName: '',
      guardianType: 'father',
      phoneNumber: '',
      address: '',
    },
    schema: insertCustomerSchema,
    loadingMessage: "Saving customer...",
    successMessage: "Customer created successfully!",
    onSuccess: () => {
      window.location.href = "/customers";
    }
  });

  return (
    <div className='space-y-4'>
      <PageHeader title='Add New Customer' />
      <CustomerForm
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}