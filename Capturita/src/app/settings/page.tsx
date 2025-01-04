'use client';

import { SideNav } from '@/components/side-nav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings } from 'lucide-react';

const shortcuts = [
    {
        key: 'Alt + R',
        description: 'Start/Stop Recording',
    },
    {
        key: 'Space',
        description: 'Play/Pause Video',
    },
    {
        key: 'F',
        description: 'Toggle Fullscreen',
    },
    {
        key: 'Left Arrow',
        description: 'Seek Backward',
    },
    {
        key: 'Right Arrow',
        description: 'Seek Forward',
    },
];

const KeyboardSettings = () => {
    return (
        <Card className='mb-8'>
            <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                    <Settings className='h-6 w-6' />
                    <span>Settings</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shortcut</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shortcuts.map((shortcut) => (
                            <TableRow key={shortcut.key}>
                                <TableCell className='font-mono'>{shortcut.key}</TableCell>
                                <TableCell>{shortcut.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default function Component() {
    return (
        <>
            <SideNav>
                <div className='d-flex flex-col w-full mx-auto p-4'>
                    <KeyboardSettings />
                </div>
            </SideNav>
        </>
    );
}
