import { plans } from '@/config/pricing-plans'
import { PricingCard } from './pricing-card'

export default function PricingSection() {
    return (
        <section id='pricing' className='relative space-y-16'>

            {/* Background Image - Adjusted for all screens */}
            <img
                src="/images/price-section-bg.png"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-30 md:opacity-40"
                alt="Background texture"
            />

            {/* Bottom Gradient Overlay - Fixed positioning to prevent gaps */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />

            <div className="relative z-30 px-6 py-12 md:py-20 bg-background/5 backdrop-blur-[2px]">
                {/* Responsive Heading */}
                <h1 className="text-center font-bold leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[64px]">
                    Choose the Plan <br className="hidden sm:block" />
                    That’s Right for You
                </h1>

                {/* Responsive Paragraph */}
                <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed opacity-80 sm:text-base md:text-[18px]">
                    Access core tracking essentials and over 1,000 data integrations out of the box.
                    Upgrade to the Pro Plan to unlock <span className="text-primary font-medium">high-frequency data processing</span>,
                    unlimited cloud storage, and professional analytical depth.
                </p>
            </div>

            <div className='flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-0 px-4'>
                {plans.map((plan => (
                    <PricingCard {...plan} key={plan.id} />
                )))}
            </div>
        </section>
    )
}
