// src/modules/customer/components/customer-manager.tsx

import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import ErrorAlert from '@/components/ui/error-alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAction } from '@/hooks/use-action';
import type { PublicCustomer } from '../customer-types';
import { actions } from 'astro:actions';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomerTable } from './customer-table';

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface CustomerManagerProps {
  errorMsg?: string;
  customers?: PublicCustomer[] | null;
  pagination?: Pagination;
  initialSearch?: string;
  isAdmin?: boolean;
}

const DEFAULT_PAGINATION: Pagination = { page: 1, pageSize: 10, total: 0, totalPages: 1 };

function syncUrl(search: string, page: number) {
  const url = new URL(window.location.href);
  search ? url.searchParams.set('search', search) : url.searchParams.delete('search');
  page > 1 ? url.searchParams.set('page', String(page)) : url.searchParams.delete('page');
  window.history.replaceState({}, '', url.toString());
}

export function CustomerManager({
  errorMsg,
  customers: initialCustomers = [],
  pagination: initialPagination = DEFAULT_PAGINATION,
  initialSearch = '',
  isAdmin = false,
}: CustomerManagerProps) {
  const [customers, setCustomers] = useState<PublicCustomer[]>(initialCustomers ?? []);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const [search, setSearch] = useState(initialSearch);
  const [fetchError, setFetchError] = useState<string | undefined>(errorMsg);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { isLoading: isDeleting, execute: executeDelete } = useAction(actions.customer.deleteCustomer, {
    onSuccess: () => window.location.reload(),
  });

  const { isLoading: isSearching, execute: executeList } = useAction(actions.customer.listCustomers, {
    onSuccess: (result) => {
      setCustomers(result.data);
      setPagination(result.pagination);
      setFetchError(undefined);
    },
    onError: (err) => setFetchError((err as any)?.message ?? 'Failed to fetch customers.'),
  });

  const fetchPage = (nextSearch: string, nextPage: number) => {
    syncUrl(nextSearch, nextPage);
    executeList({ search: nextSearch || undefined, page: nextPage, pageSize: pagination.pageSize });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPage(value, 1), 350);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages || page === pagination.page) return;
    fetchPage(search, page);
  };

  const startRecord = (pagination.page - 1) * pagination.pageSize + 1;
  const endRecord = Math.min(pagination.page * pagination.pageSize, pagination.total);

  return (
    <div className='space-y-8'>
      <ErrorAlert errorMsg={fetchError} />

      <PageHeader title='Customer Management'>
        <Button asChild className='uppercase w-full md:w-auto'>
          <a href="/customers/new">
            <Plus className="w-4 h-4 mr-2" /> Add New Customer
          </a>
        </Button>
      </PageHeader>

      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder='Search by serial number...'
          className='pl-9'
        />
      </div>

      {!fetchError && (
        <CustomerTable
          customers={customers}
          isAdmin={isAdmin}
          onDelete={(id) => executeDelete({ id })}
          onUpdate={(id) => {
            window.location.href = `/customers/${id}/update`;
          }}
        />
      )}

      {!fetchError && pagination.total > 0 && (
        <div className='flex items-center justify-between pt-2'>
          <p className='text-sm text-muted-foreground'>
            Showing {startRecord}–{endRecord} of {pagination.total} customers
          </p>
          {pagination.totalPages > 1 && (
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='icon'
                disabled={pagination.page <= 1 || isSearching}
                onClick={() => goToPage(pagination.page - 1)}
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              <span className='text-sm'>{pagination.page} / {pagination.totalPages}</span>
              <Button
                variant='outline'
                size='icon'
                disabled={pagination.page >= pagination.totalPages || isSearching}
                onClick={() => goToPage(pagination.page + 1)}
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}