import { Button } from '@/components/ui/button'
import ErrorAlert from '@/components/ui/error-alert'
import { Plus, ChevronRight, User } from 'lucide-react'

interface ProductManagerProps {
    customerId: string;
    customerName?: string;
    serialNumber?: string;
    errorMsg?: string;
}

export function ProductManager({ customerId, customerName, serialNumber , errorMsg}: ProductManagerProps) {
    return (
        <div className='space-y-6'>
            <ErrorAlert errorMsg={errorMsg} />

            {/* 1. Breadcrumb Navigation */}
            <nav className='flex items-center gap-2 text-xs text-zinc-400'>
                <a href="/customers" className='hover:text-white transition-colors'>
                    গ্রাহক তালিকা (Customers)
                </a>
                <ChevronRight className='w-3 h-3' />
                <span className='text-zinc-200 font-medium'>{customerName}</span>
            </nav>

            {/* 2. Focused Customer Profile Bar */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5'>
                <div className='flex items-center gap-4'>
                    {/* User Icon Avatar */}
                    <div className='w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0'>
                        <User className='w-6 h-6 text-zinc-300' />
                    </div>

                    {/* Customer Info */}
                    <div>
                        <div className='flex items-center gap-2'>
                            <h1 className='text-xl font-bold text-white'>{customerName}</h1>
                            <span className='px-2 py-0.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-md font-mono'>
                                #{serialNumber}
                            </span>
                        </div>
                        <p className='text-xs text-zinc-400 mt-1'>
                            পণ্য ব্যবস্থাপনা (Product Management)
                        </p>
                    </div>
                </div>

                {/* 3. Action Button */}
                <Button asChild className='uppercase shrink-0'>
                    <a href={`/customers/${customerId}/products/new`}>
                        <Plus className="w-4 h-4 mr-2" /> Add New Product
                    </a>
                </Button>
            </div>
        </div>
    )
}