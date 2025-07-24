import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDateString = (d: Date) => d.toLocaleDateString('sv-SE');

export const getToday = () => toDateString(new Date());
