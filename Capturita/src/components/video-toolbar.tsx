'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';

interface VideoToolbarProps {
    gradientStart: string;
    gradientEnd: string;
    padding: number;
    borderRadius: number;
    setGradientStart: (gradient: string) => void;
    setGradientEnd: (gradient: string) => void;
    setPadding: (padding: number) => void;
    setBorderRadius: (borderRadius: number) => void;
}

export const VideoToolbar = ({
    gradientStart,
    gradientEnd,
    padding,
    borderRadius,
    setGradientEnd,
    setGradientStart,
    setPadding,
    setBorderRadius,
}: VideoToolbarProps) => {
    return (
        <div className='flex flex-col border rounded-lg p-6 my-5 w-full max-w-md bg-card shadow-sm'>
            <div className='space-y-6'>
                <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Background Gradient</Label>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label className='text-xs text-muted-foreground'>Start Color</Label>
                            <Input value={gradientStart} type='color' onChange={(e) => setGradientStart(e.target.value)} className='h-10 w-full' />
                        </div>
                        <div>
                            <Label className='text-xs text-muted-foreground'>End Color</Label>
                            <Input value={gradientEnd} type='color' className='h-10 w-full' onChange={(e) => setGradientEnd(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Padding ({padding}px)</Label>
                    <Slider
                        value={[padding]}
                        min={0}
                        max={50}
                        step={1}
                        className='my-2'
                        defaultValue={[10]}
                        onValueChange={([value]) => setPadding(value)}
                    />
                </div>

                <div className='space-y-2'>
                    <Label className='text-sm font-medium'>Border Radius ({borderRadius}px)</Label>
                    <Slider
                        value={[borderRadius]}
                        min={0}
                        max={50}
                        step={1}
                        className='my-2'
                        defaultValue={[16]}
                        onValueChange={([value]) => setBorderRadius(value)}
                    />
                </div>
            </div>
        </div>
    );
};
