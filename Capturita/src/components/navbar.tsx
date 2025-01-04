'use client';

import { Moon, Sun, Video } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const { setTheme, theme } = useTheme();

    return (
        <nav className='border-b'>
            <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <Video className='h-6 w-6' />
                    <span className='text-xl font-bold'>Capturita Pro</span>
                </div>
                <Button variant='ghost' size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                    <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </div>
        </nav>
    );
}
