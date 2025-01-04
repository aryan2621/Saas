'use client';

import * as React from 'react';
import {
    AudioWaveform,
    Command,
    Home,
    Search,
    Sparkles,
    User,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
const data = {
    teams: [
        {
            name: 'Bounty Hunter',
            logo: Command,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Home',
            url: '/',
            icon: Home,
            isActive: false,
        },
        {
            title: 'Search',
            url: '#',
            icon: Search,
            isActive: false,
        },
        {
            title: 'Ask AI',
            url: '#',
            icon: Sparkles,
            isActive: false,
        },
        {
            title: 'Profile',
            url: '/user',
            icon: User,
            badge: '10',
            isActive: false,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    data.navMain.forEach((item) => {
        item['isActive'] = pathname === item.url;
    });

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
                <NavMain items={data.navMain} />
            </SidebarHeader>
            <SidebarContent></SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
