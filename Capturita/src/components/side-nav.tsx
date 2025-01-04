'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import ky from 'ky';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, History, Settings, Mail, PanelLeftClose, PanelLeftOpen, HandCoins, LogOut } from 'lucide-react';
import { Navbar } from './navbar';
import { User } from '@/model/user';
import { useUserStore } from '@/context/user';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/billing', label: 'Billing', icon: HandCoins },
    { href: '/contact', label: 'Contact', icon: Mail },
];
export const SideNav = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const user = useUserStore((state) => state.user);

    const router = useRouter();
    const toggleSidebar = () => setIsCollapsed((prev) => !prev);

    const logOut = async () => {
        try {
            setIsLoggingOut(true);
            await ky.get('/api/logout');
            router.push('/login');
        } catch (error) {
            console.error('Error while logging out', error);
        } finally {
            setIsLoggingOut(false);
        }
    };
    return (
        <div className='flex min-h-screen'>
            <aside
                className={cn(
                    'flex flex-col justify-between bg-background border-r transition-all duration-300 ease-in-out',
                    isCollapsed ? 'w-16' : 'w-64'
                )}
            >
                <div>
                    <div className={cn('p-4 flex items-center', isCollapsed ? 'justify-center' : 'justify-between')}>
                        {!isCollapsed && (
                            <Link href='/' className='flex items-center space-x-2'>
                                <span className='font-bold text-2xl'>Logo</span>
                            </Link>
                        )}
                        <Button variant='ghost' size='icon' onClick={toggleSidebar}>
                            {isCollapsed ? <PanelLeftOpen className='h-5 w-5' /> : <PanelLeftClose className='h-5 w-5' />}
                        </Button>
                    </div>

                    <nav className='space-y-2 p-2'>
                        {navItems.map(({ href, label, icon: Icon }) => (
                            <NavItem key={href} href={href} label={label} icon={<Icon className='h-5 w-5' />} isCollapsed={isCollapsed} />
                        ))}
                    </nav>
                </div>

                <div className='p-4'>
                    {user && (
                        <>
                            <UserProfile isCollapsed={isCollapsed} user={user} />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='w-full justify-start mt-2'
                                            size={isCollapsed ? 'icon' : 'default'}
                                            onClick={logOut}
                                            disabled={isLoggingOut}
                                        >
                                            <LogOut className='h-5 w-5' />
                                            {!isCollapsed && <span className='ml-2'>Logout</span>}
                                        </Button>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent side='right'>
                                            <p>Logout</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </div>
            </aside>

            <main className='flex-1'>
                <Navbar />
                <div className='p-4'>{children}</div>
            </main>
        </div>
    );
};

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isCollapsed }) => {
    const pathname = usePathname();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        prefetch={false}
                        className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                            isCollapsed ? 'justify-center' : '',
                            pathname === href ? 'bg-accent text-accent-foreground' : ''
                        )}
                    >
                        {icon}
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side='right'>
                        <p>{label}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};

const UserProfile: React.FC<{ isCollapsed: boolean; user: User | null }> = ({ isCollapsed, user }) => {
    return (
        <div className={cn('flex items-center space-x-2', isCollapsed ? 'justify-center' : '')}>
            <Avatar>
                <AvatarImage src={user?.picture} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
                <div>
                    <p className='text-sm font-medium'>{user?.name}</p>
                    <p className='text-xs text-muted-foreground'>{user?.email}</p>
                </div>
            )}
        </div>
    );
};
