import { describe, it, expect } from 'vitest';
import { cn, formatDate } from '../utils';

describe('cn', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional class names', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
  });

  it('merges Tailwind CSS classes correctly', () => {
    expect(cn('px-2 py-1', 'p-3')).toBe('p-3');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles mixed inputs', () => {
    expect(cn('font-bold', { 'text-lg': true, 'text-sm': false }, 'p-4', 'px-2')).toBe('font-bold text-lg p-4 px-2');
  });
});

describe('formatDate', () => {
  it('formats date for upcoming mode correctly', () => {
    const date = new Date('2025-07-15T10:00:00Z'); // July 15, 2025, Tuesday
    expect(formatDate(date, 'upcoming')).toBe('7/15(火)');
  });

  it('formats date for past mode correctly', () => {
    const date = new Date('2025-07-15T10:00:00Z'); // July 15, 2025, Tuesday
    expect(formatDate(date, 'past')).toBe('2025/7/15(火)');
  });

  it('handles different days of the week', () => {
    // Sunday
    const sunday = new Date('2025-07-13T10:00:00Z');
    expect(formatDate(sunday, 'upcoming')).toBe('7/13(日)');

    // Saturday
    const saturday = new Date('2025-07-12T10:00:00Z');
    expect(formatDate(saturday, 'upcoming')).toBe('7/12(土)');
  });

  it('handles single digit month and day', () => {
    const date = new Date('2025-01-01T10:00:00Z'); // January 1, 2025, Wednesday
    expect(formatDate(date, 'upcoming')).toBe('1/1(水)');
    expect(formatDate(date, 'past')).toBe('2025/1/1(水)');
  });

  it('handles double digit month and day', () => {
    const date = new Date('2025-12-25T10:00:00Z'); // December 25, 2025, Thursday
    expect(formatDate(date, 'upcoming')).toBe('12/25(木)');
    expect(formatDate(date, 'past')).toBe('2025/12/25(木)');
  });
});
