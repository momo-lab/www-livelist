import { describe, expect, it, vi } from 'vitest';
import { getToday, toDateString } from '../date';

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
