import { describe, expect, it, vi } from 'vitest';
import { cn, getToday, toDateString } from '../utils';

describe('cn', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional class names', () => {
    expect(cn('class1', 'class2', null)).toBe('class1 class2');
  });

  it('merges Tailwind CSS classes correctly', () => {
    expect(cn('px-2 py-1', 'p-3')).toBe('p-3');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles mixed inputs', () => {
    expect(cn('font-bold', { 'text-lg': true, 'text-sm': false }, 'p-4', 'px-2')).toBe(
      'font-bold text-lg p-4 px-2'
    );
  });
});

describe('toDateString', () => {
  it('should return a new Date object with time set to 00:00:00', () => {
    const originalDate = new Date('2023-01-15T10:30:00Z');
    const result = toDateString(originalDate);
    expect(result).toBe('2023-01-15');
  });
});

describe('getToday', () => {
  it(`should return today's date with time set to 00:00:00`, () => {
    vi.setSystemTime(new Date('2025-01-01T08:15:00Z'));
    const result = getToday();
    expect(result).toBe('2025-01-01');
  });
});
