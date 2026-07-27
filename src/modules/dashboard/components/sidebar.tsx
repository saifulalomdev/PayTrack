import { cn } from '@/lib/utils';
import { adminNavItems } from '@/config/admin-nav-items';
import { AppBranding } from '@/components/brand';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardSidebarProps {
    className?: string
}

export default function DashboardSidebar({ className }: DashboardSidebarProps) {

    return (
        <Card className={cn('w-full overflow-y-auto md:w-60 lg:w-75 border-r h-dvh flex flex-col justify-between z-30', className)}>
           <CardContent>
             <div>
                {/* sidebar header */}
                <AppBranding border={true}/>
                {/* sidebar navigations */}
                <nav className='mt-4 space-y-4'>
                    {adminNavItems.map(({ href, name, Icon }) => (
                        <a
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                            {/* Render Icon with consistent sizing */}
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="text-sm">{name}</span>
                        </a>
                    ))}
                </nav>
            </div>
           </CardContent>
        </Card>
    )
}
