'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RecordingSettingsProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RecordingSettings({ open, onOpenChange }: RecordingSettingsProps) {
    const [background, setBackground] = useState<string>('#ffffff');

    const generateRandomGradient = () => {
        const color1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const color2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const angle = Math.floor(Math.random() * 360);
        return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>Recording Settings</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue='color'>
                    <TabsList className='grid w-full grid-cols-3'>
                        <TabsTrigger value='image'>Image</TabsTrigger>
                        <TabsTrigger value='gradient'>Gradient</TabsTrigger>
                    </TabsList>
                    <TabsContent value='image' className='space-y-4'>
                        <div className='grid gap-4'>
                            <div className='space-y-2'>
                                <Label>Upload Image</Label>
                                <Input type='file' accept='image/*' />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value='gradient' className='space-y-4'>
                        <div className='grid gap-4'>
                            <Button onClick={() => setBackground(generateRandomGradient())}>Generate Random Gradient</Button>
                            <div className='w-full h-32 rounded-lg border' style={{ background: background }} />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
