'use client';

import { useState } from 'react';
import { RangeSlider } from '@/components/range-slider';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

interface TrimControlsProps {
    duration: number;
    onTrim: (start: number, end: number) => void;
}

export function TrimControls({ duration, onTrim }: TrimControlsProps) {
    const [range, setRange] = useState([0, duration]);

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between text-sm'>
                <span>Start: {formatTime(range[0])}</span>
                <span>End: {formatTime(range[1])}</span>
            </div>
            <RangeSlider defaultValue={[0, duration]} max={duration} step={0.1} value={range} onValueChange={setRange} />
            <Button onClick={() => onTrim(range[0], range[1])} className='w-full'>
                Apply Trim
            </Button>
        </div>
    );
}
