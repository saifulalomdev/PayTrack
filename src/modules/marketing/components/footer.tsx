import { helpMenus } from '@/config/help-menus'
import { navItems } from '@/config/nav-items'
import { socialLinks } from '@/data/social-links'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from '@/components/ui/tooltip'

export function Footer() {
    return (
        <footer id='footer' className='px-6 md:px-10 lg:px-15 xl:px-25 pt-15 border-t'>
            {/* Navigations Section */}
            <div className='w-full border-b pb-12 border-white/10 grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-4'>

                {/* About Us section - Spans full width on mobile, 2 cols on Desktop */}
                <div className='md:col-span-3 xl:col-span-2 pr-0'>
                    <h2 className='text-3xl font-bold tracking-tight'>About Us</h2>
                    <p className='text-lg opacity-70 mt-4 leading-relaxed'>
                        We’re an open-source software project building high-performance tracking tools that empower developers to turn raw metrics into structured insights faster, more safely, and independently.
                    </p>
                </div>

                {/* Navigation links */}
                <div className='space-y-4'>
                    <h3 className='text-xl font-bold text-primary'>Navigation Links</h3>
                    <nav className='flex flex-col gap-2'>
                        {navItems.map(({ name, href }) => (
                            <a
                                className='text-base opacity-75 hover:opacity-100 hover:text-primary transition-all hover:underline w-fit'
                                key={name}
                                href={href}
                            >
                                {name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Connect section */}
                <div className='space-y-4'>
                    <h3 className='text-xl font-bold text-primary'>Connect With Us</h3>
                    <div className='flex flex-col gap-3 text-base opacity-75'>
                        <address className='not-italic leading-relaxed'>
                            Sylhet, 3100, Bangladesh
                        </address>
                        <a href="mailto:hello@saifulalom.com" className="hover:text-primary transition-colors underline decoration-primary/30">hello@saifulalom.com</a>
                    </div>
                </div>
            </div>

            {/* Copyright and Socials */}
            <div className='flex flex-col md:flex-row justify-between items-center gap-6 py-10'>
                <p className='text-sm text-muted-foreground order-2 md:order-1'>
                    © {new Date().getFullYear()} <span className="text-foreground font-medium">Track Flow</span>. All Rights Reserved.
                </p>

                <TooltipProvider>
                    <div className='flex gap-3 order-1 md:order-2'>
                        {socialLinks.map(({ href, name, Icon }) => (
                            <Tooltip key={name} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <a
                                        className='border border-primary/80 p-2.5 text-primary/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300'
                                        href={href}
                                        aria-label={name}
                                        target='_blank'
                                    >
                                        <Icon size={18} />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent className='bg-primary text-primary-foreground'>
                                    <p>{name}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>
        </footer>
    )
}