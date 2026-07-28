import { Card, CardContent } from '@/components/ui/card';
import { Globe, User, Menu, X, XIcon } from "lucide-react";
import { adminNavItems } from '@/data/nav-nav-item';
import { AppBranding } from '@/components/brand';
import { Button } from "@/components/ui/button";
import React, { useState } from 'react';
import { cn } from '@/utils/utils';


export function DashboardLayout({ children }: { children: React.ReactNode }) {
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



interface DashboardHeaderProps {
    isSidebarOpen: boolean;
    onClick: () => void;
}

export function DashboardHeader({ isSidebarOpen, onClick }: DashboardHeaderProps) {
    const [language, setLanguage] = useState<"EN" | "BN">("EN");

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "EN" ? "BN" : "EN"));
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:px-6">
            {/* Left side: Toggle button for mobile */}
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

            {/* Right side actions */}
            <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <Button
                    onClick={toggleLanguage}
                    aria-label="Switch Language"
                    variant="outline"
                >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{language === "EN" ? "English" : "বাংলা"}</span>
                </Button>

                {/* User Profile */}
                <div className="flex items-center gap-2 border-l pl-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">Admin</span>
                </div>
            </div>
        </header>
    );
}