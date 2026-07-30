import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, User, Menu, X, XIcon, ChevronRight } from "lucide-react";
import { adminNavItems } from '@/data/nav-nav-item';
import { AppBranding } from '@/components/brand';
import { Button } from "@/components/ui/button";
import { cn } from '@/utils/utils';
import { $t, $language, toggleLanguage } from '@/stores/i18nStore';

interface CurrentStaff {
    name: string;
    role: "admin" | "staff";
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    staff: CurrentStaff; // passed from the .astro page via context.locals.staff
}

export function DashboardLayout({ children, staff }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex overflow-x-hidden w-full h-dvh">
            <DashboardSidebar
                className="hidden lg:flex"
            />
            <DashboardSidebar
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                    "lg:hidden fixed top-0 left-0 flex h-dvh transition-all duration-300 z-40",
                    isSidebarOpen ? "opacity-100 left-0" : "opacity-0 -translate-x-full"
                )}
            />
            <div className="flex-1 overflow-y-auto">
                <DashboardHeader
                    isSidebarOpen={isSidebarOpen}
                    onClick={() => setIsSidebarOpen(p => !p)}
                    staff={staff}
                />
                <main className="p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}

interface DashboardSidebarProps {
    className?: string,
    onClick?: () => void
}

function DashboardSidebar({ className, onClick }: DashboardSidebarProps) {
    // 1. Read translated strings from $t store
    const t = useStore($t);

    return (
        <Card className={cn('w-full overflow-y-auto md:w-60 lg:w-75 border-r h-dvh flex flex-col justify-between z-30', className)}>
            <CardContent>
                <div>
                    {/* sidebar header */}
                    <div className='flex gap-3 items-center'>
                        <AppBranding border={true} />
                        <Button onClick={onClick} className='lg:hidden' variant="ghost" >
                            <XIcon />
                        </Button>
                    </div>
                    {/* sidebar navigations */}
                    <nav className='mt-8'>
                        {adminNavItems.map(({ href, key, Icon }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={onClick}
                                className={cn(
                                    "flex items-center justify-between gap-3 py-4 border-b transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                                <div className='flex gap-3 items-center'>
                                    <Icon className="h-5 w-5 shrink-0" />
                                    <span className="text-lg">{t.common[key]}</span>
                                </div>
                                <ChevronRight />
                            </a>
                        ))}
                    </nav>
                </div>
            </CardContent>
        </Card>
    );
}

interface DashboardHeaderProps {
    isSidebarOpen: boolean;
    onClick: () => void;
    staff: CurrentStaff;
}

function DashboardHeader({ isSidebarOpen, onClick, staff }: DashboardHeaderProps) {
    const language = useStore($language);
    const t = useStore($t);

    // Localized role label — falls back to the raw role if translations
    // for it aren't defined yet in your i18n store.
    const roleLabel = t.common[staff.role] ?? (staff.role === "admin" ? "Admin" : "Staff");

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:px-6">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onClick}
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    onClick={toggleLanguage}
                    aria-label="Switch Language"
                    variant="outline"
                >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{language === "EN" ? "English" : "বাংলা"}</span>
                </Button>

                <div className="flex items-center gap-2 border-l pl-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">{staff.name}</span>
                        <span className="text-xs text-muted-foreground">{roleLabel}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}