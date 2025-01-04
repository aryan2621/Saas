import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
    return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0')}`;
}
export function convertToSubcurrency(amount: number, factor = 100) {
    return Math.round(amount * factor);
}
