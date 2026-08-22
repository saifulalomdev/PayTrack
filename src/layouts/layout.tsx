import { Globe, User, Menu, X, XIcon, ChevronRight, LogOut } from "lucide-react";
import { $t, $language, toggleLanguage } from '@/stores/i18nStore';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent } from '@/components/ui/card';
import { adminNavItems } from '@/data/nav-items';
import { AppBranding } from '@/components/brand';
import { Button } from "@/components/ui/button";
import { useStore } from '@nanostores/react';
import type { Theme } from "@/types/theme";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { useAction } from "@/hooks/use-action";
import { actions } from "astro:actions";


interface CurrentStaff {
    name: string;
    role: "admin" | "staff";
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    staff: CurrentStaff;
    theme?: Theme
}

export function DashboardLayout({ children, staff, theme }: DashboardLayoutProps) {
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
                    theme={theme}
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
                        <button onClick={onClick} className='lg:hidden'>
                            <XIcon />
                        </button>
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
                                    <span className="text-lg uppercase">{t.common[key]}</span>
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
    theme?: Theme;
}

function DashboardHeader({ isSidebarOpen, onClick, staff, theme = "light" }: DashboardHeaderProps) {
    const language = useStore($language);

    const { isLoading, execute } = useAction(actions.auth.logout, {
        loadingMessage: "Logging out...",
        onSuccess: () => {
            window.location.href = "/login"
        }
    })

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 lg:px-6">
            <div className="flex items-center gap-3">
                <button
                    className="lg:hidden"
                    onClick={onClick}
                    aria-label="Toggle Sidebar"
                >
                    {isSidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle currentTheme={theme} />
                <Button
                    onClick={toggleLanguage}
                    aria-label="Switch Language"
                    variant="outline"
                >
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{language === "EN" ? "English" : "বাংলা"}</span>
                </Button>

                <div className="items-center gap-2 border-l pl-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary" className="border rounded-full">
                                <User className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium leading-none">{staff.name}</span>
                                <span className="text-xs capitalize text-muted-foreground">{staff.role}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => execute(undefined)} className="cursor-pointer text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{isLoading ? "Logging out..." : "Logout"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}