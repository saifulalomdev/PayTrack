import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function GetStarted() {
    return (
        <a href="/#pricing"  className='w-full md:w-auto'>
            <Button size="lg" className='font-bold md:w-auto w-full'>
                Get started <ArrowUpRight/>
            </Button>
        </a>
    )
}
