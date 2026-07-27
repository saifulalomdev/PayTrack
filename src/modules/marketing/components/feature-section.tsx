import { Button } from '@/components/ui/button'
import { features } from '@/data/features'
import { cn } from '@/lib/utils'
import { FeaturesCard } from './feature-card'
import { GetStarted } from './get-started-button'

export function FeaturesSection() {
    return (
        <section id='features' className='px-6 md:px-10 lg:px-20 mt-10 md:mt-19.5 space-y-10 md:space-y-14 overflow-hidden'>
            {/* Header Section */}
            <div className='flex flex-col lg:flex-row w-full justify-between items-center gap-10'>
                <div className="text-center lg:text-left">
                    <h1 className='text-4xl md:text-5xl lg:text-[64px] font-bold leading-tight'>
                        Deployed for Privacy.
                    </h1>
                    <h1 className='text-4xl md:text-5xl lg:text-[64px] lg:-mt-4 leading-tight'>
                        Driven by <span className='text-primary font-bold'> Edge.</span>
                    </h1>
                    <h1 className='text-base md:text-[18px] text-foreground/80 mt-6 max-w-xl mx-auto lg:mx-0 font-normal'>
                        Unlock the full power of your cloud database with our high-performance tracking engine.
                        Explore new scales of serverless execution.
                    </h1>
                </div>
                <div className='shrink-0'>
                    <img
                        src="/images/cube.svg"
                        alt="Analytics Data Cube"
                        className="opacity-90 brightness-110 w-40 md:w-60 lg:w-62.5"
                    />
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {features.map((feature, index) => (
                    <FeaturesCard
                        {...feature}
                        key={feature.title}
                        className={cn(
                            "md:col-span-1",
                            index === 0 || index === 3 ? "lg:col-span-2" : "lg:col-span-3"
                        )}
                    />
                ))}
            </div>

            {/* Quote/Mission Section */}
            <div className='max-w-4xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-start py-10'>
                <h3 className='text-muted-foreground text-xl md:mt-1'>
                    {new Date().getFullYear()}
                </h3>
                <p className='text-xl md:text-[27px] font-bold leading-snug'>
                    Whether you&apos;re launching personal sites, monitoring startup traffic, or hosting developer-level instances, our high-performance platform is built to turn your data into insights—freely, securely, and transparently.
                </p>
            </div>
        </section>
    )
}

