import React from 'react';
import { Home, Users, UserRound } from 'lucide-react';

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    isPrimary?: boolean;
}

const navItems: NavItem[] = [
    {
        icon: Home,
        label: 'Home',
        href: '/'
    },
    {
        icon: UserRound,
        label: 'Customers',
        href: '/customers',
        isPrimary: true
    },
    {
        icon: Users,
        label: 'Staff',
        href: '/staff'
    },
];

export function BottomNav({ currentPath = '/' }: { currentPath?: string }) {
    return (
        <nav className="fixed bottom-10 left-0 right-0 z-50 bg-white border-gray-200 px-8 py-2">
            <div className="flex items-center justify-around max-w-sm mx-auto border rounded-xl">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.href;

                    if (item.isPrimary) {
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center -mt-6"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                                    <Icon className="w-6 h-6 stroke-[2.5]" />
                                    <span className="sr-only">{item.label}</span>
                                </div>
                                <span className="text-[10px] font-medium text-indigo-600 mt-1">
                                    {item.label}
                                </span>
                            </a>
                        );
                    }

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 p-1 rounded-lg transition-colors min-w-[64px] ${isActive
                                    ? 'text-indigo-600 font-semibold'
                                    : 'text-gray-500 hover:text-gray-900 font-normal'
                                }`}
                        >
                            <Icon className="w-5 h-5 stroke-[1.75]" />
                            <span className="text-[11px] leading-none">{item.label}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}