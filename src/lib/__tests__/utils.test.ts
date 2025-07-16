import { describe, expect, it } from 'vitest';
import { cn, formatDate, getToday, toDate } from '../utils';

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

describe('formatDate', () => {
  it('formats date for upcoming mode correctly', () => {
    const date = new Date('2025-07-15T10:00:00Z'); // July 15, 2025, Tuesday
    expect(formatDate(date)).toBe('7/15(火)');
  });

  it('formats date for past mode correctly', () => {
    const date = new Date('2025-07-15T10:00:00Z'); // July 15, 2025, Tuesday
    expect(formatDate(date)).toBe('7/15(火)');
  });

  it('handles different days of the week', () => {
    // Sunday
    const sunday = new Date('2025-07-13T10:00:00Z');
    expect(formatDate(sunday)).toBe('7/13(日)');

    // Saturday
    const saturday = new Date('2025-07-12T10:00:00Z');
    expect(formatDate(saturday)).toBe('7/12(土)');
  });

  it('handles single digit month and day', () => {
    const date = new Date('2025-01-01T10:00:00Z'); // January 1, 2025, Wednesday
    expect(formatDate(date)).toBe('1/1(水)');
    expect(formatDate(date)).toBe('1/1(水)');
  });

  it('handles double digit month and day', () => {
    const date = new Date('2025-12-25T10:00:00Z'); // December 25, 2025, Thursday
    expect(formatDate(date)).toBe('12/25(木)');
    expect(formatDate(date)).toBe('12/25(木)');
  });
});

describe('toDate', () => {
  it('should return a new Date object with time set to 00:00:00', () => {
    const originalDate = new Date('2023-01-15T10:30:00Z');
    const expectedDate = new Date(
      originalDate.getFullYear(),
      originalDate.getMonth(),
      originalDate.getDate()
    );
    const result = toDate(originalDate);
    expect(result.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0]);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('should not modify the original Date object', () => {
    const originalDate = new Date('2023-01-15T10:30:00Z');
    const originalDateCopy = new Date(originalDate.getTime());
    toDate(originalDate);
    expect(originalDate.getTime()).toBe(originalDateCopy.getTime());
  });
});

describe('getToday', () => {
  it(`should return today's date with time set to 00:00:00`, () => {
    const today = new Date();
    const result = getToday();
    expect(result.getFullYear()).toBe(today.getFullYear());
    expect(result.getMonth()).toBe(today.getMonth());
    expect(result.getDate()).toBe(today.getDate());
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });
});
