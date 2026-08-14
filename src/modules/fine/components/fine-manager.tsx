// src/modules/fine/components/fine-manager.tsx
import { Button } from '@/components/ui/button'
import ErrorAlert from '@/components/ui/error-alert'
import { Plus, ChevronRight, Package } from 'lucide-react'
import { actions } from 'astro:actions'
import { useAction } from '@/hooks/use-action'
import FineTable from './fine-table'
import type { PublicFine } from '../fine-types'

interface FineManagerProps {
    customerId: string;
    productId: string;
    customerName?: string;
    productName?: string;
    errorMsg?: string;
    fines: PublicFine[];
    isAdmin?: boolean;
}

export function FineManager({
    customerId,
    productId,
    customerName,
    productName,
    errorMsg,
    fines,
    isAdmin = false,
}: FineManagerProps) {
    const { execute: executeDelete, isLoading: isDeleting } = useAction(
        actions.fine.deleteFine,
        {
            loadingMessage: 'মুছে ফেলা হচ্ছে...',
            successMessage: 'জরিমানা মুছে ফেলা হয়েছে!',
            onSuccess: () => {
                window.location.reload();
            },
        }
    );

    const handleDelete = (id: string) => {
        executeDelete({ id });
    };

    const handleUpdate = (id: string) => {
        window.location.href = `/customers/${customerId}/products/${productId}/fines/${id}/update`;
    };

    return (
        <div className='space-y-6'>
            <ErrorAlert errorMsg={errorMsg} />

            <nav className='flex items-center gap-2 text-xs text-zinc-400'>
                <a href="/customers" className='hover:text-white transition-colors'>
                    গ্রাহক তালিকা (Customers)
                </a>
                <ChevronRight className='w-3 h-3' />
                <a href={`/customers/${customerId}/products`} className='hover:text-white transition-colors'>
                    {customerName}
                </a>
                <ChevronRight className='w-3 h-3' />
                <span className='text-zinc-200 font-medium'>জরিমানা (Fines)</span>
            </nav>

            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0'>
                        <Package className='w-6 h-6 text-zinc-300' />
                    </div>

                    <div>
                        <h1 className='text-xl font-bold text-white'>{productName}</h1>
                        <p className='text-xs text-zinc-400 mt-1'>
                            জরিমানা ব্যবস্থাপনা (Fine Management)
                        </p>
                    </div>
                </div>

                <Button asChild className='uppercase shrink-0'>
                    <a href={`/customers/${customerId}/products/${productId}/fines/new`}>
                        <Plus className="w-4 h-4 mr-2" /> Add New Fine
                    </a>
                </Button>
            </div>

            <FineTable
                fines={fines}
                isDeleting={isDeleting}
                isAdmin={isAdmin}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    )
}