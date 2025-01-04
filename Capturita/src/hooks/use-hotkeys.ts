'use client';

import { useEffect } from 'react';

export function useHotkeys(key: string, callback: () => void) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const keys = key.toLowerCase().split('+');
            const modifiers = {
                alt: keys.includes('alt'),
                ctrl: keys.includes('ctrl'),
                shift: keys.includes('shift'),
            };

            if (
                event.key.toLowerCase() === keys[keys.length - 1] &&
                event.altKey === modifiers.alt &&
                event.ctrlKey === modifiers.ctrl &&
                event.shiftKey === modifiers.shift
            ) {
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, callback]);
}
