import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "./footer";
import { faqs } from "@/data/faqs";
import { GetStarted } from "./get-started-button";


export function FAQAndFootersection() {
    return (
        <section id="FAQs" className='pt-36 relative space-y-16 overflow-hidden'>


            {/* Top Left Background - Hide on smallest mobile to keep UI clean */}
            <img
                src="/images/faqs-left-side-top-bg.png"
                alt=""
                className="absolute left-0 top-0 opacity-40 md:opacity-100 w-1/2 md:w-auto pointer-events-none -z-10"
            />

            {/* Bottom Left Background - Adjusted top-200 to something relative like % or smaller rem */}
            <img
                src="/images/faqs-left-side-botton-bg.png"
                alt=""
                className="absolute -left-10 top-[40%] md:top-200 opacity-30 md:opacity-100 pointer-events-none -z-10"
            />

            {/* Right Side Background */}
            <img
                src="/images/faqs-right-side-bg.png"
                alt=""
                className="absolute right-0 top-80 opacity-50 md:opacity-100 w-1/3 md:w-auto pointer-events-none -z-10"
            />

            {/* Decorative Lines - Hidden on Mobile to save performance and prevent clutter */}
            <img
                src="/images/faqs-top-line.png"
                alt=""
                className="hidden lg:block absolute -z-10 right-0 bottom-50 opacity-36 pointer-events-none"
            />
            <img
                src="/images/faqs-bottom-line.png"
                alt=""
                className="hidden lg:block absolute -z-10 right-0 bottom-16 opacity-30 pointer-events-none"
            />

            {/* The Main Glow - This is the primary 'Overflow' culprit */}
            <div className="
    absolute -z-10 blur-3xl rounded-full bg-primary/20
    /* Mobile: Smaller and tucked further away */
    size-80 -right-20 bottom-20 
    /* Desktop: The large version you had */
    md:size-235 md:-right-140 md:bottom-10 
    pointer-events-none
" />
            <div className='px-6'> {/* Wrapper to prevent text touching screen edges on mobile */}
                <div>
                    <h2 className='font-bold text-4xl md:text-5xl lg:text-[64px] text-center leading-tight tracking-tight'>
                        Frequently Asked <br className="hidden sm:block" />
                        Questions
                    </h2>
                    <p className='text-base md:text-[18px] text-foreground/80 max-w-2xl text-center mt-5 mx-auto font-normal'>
                        Got questions? We&apos;ve got answers. Find everything you need to know about setting up your instance, code, and deployment.
                    </p>
                </div>

                <Accordion
                    type="single"
                    collapsible
                    defaultValue={faqs[0].question}
                    /* Changed max-w-222.5 to a responsive width */
                    className="w-full max-w-4xl mx-auto mt-12 md:mt-20"
                >
                    {faqs.map((item, index) => (
                        <AccordionItem key={index} value={item.question} className="border-b border-white/10">
                            <AccordionTrigger className="text-lg md:text-xl text-left py-6">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base md:text-[18px] opacity-75 leading-relaxed pb-6">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            <div className="
            /* Mobile Styles (Default) */
            px-6 py-12 mt-20 mx-4 border text-center rounded-2xl space-y-6 
            
            /* Tablet Styles (md: 768px+) */
            md:px-16 md:py-14 md:mt-40 md:mx-auto md:max-w-2xl md:space-y-8
            
            /* Desktop Styles (lg: 1024px+) */
            lg:px-45 lg:py-20 lg:mt-70 lg:max-w-[1080px] lg:space-y-9
           ">
                <h1 className="
                    /* Scale font size based on screen width */
                    font-bold text-3xl leading-tight 
                    sm:text-4xl 
                    md:text-5xl 
                    lg:text-[64px]
                ">
                    Ready to Host Smarter?
                </h1>

                <p className="  opacity-80 text-sm  md:text-base  lg:text-[18px]  max-w-xl mx-auto font-normal">
                    Whether you&apos;re a developer, a startup, or a privacy specialist—our platform adapts to your cloud needs. Monitor faster. Scale better.
                </p>

                <GetStarted />
            </div>

            <Footer />
        </section>
    )
}
