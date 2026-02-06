import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockEvents } from '@/__mocks__';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import { useEventTableData } from '../useEventTableData';

// Mock useLiveEvents hook
vi.mock('@/providers/LiveEventsProvider');

// Mock formatDate utility (already tested, but for isolation)
vi.mock('@/lib/utils', async () => {
  const originalModule = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils');
  return {
    ...originalModule,
    formatDate: vi.fn((date: Date, mode: string) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      return mode === 'past'
        ? `${year}/${month}/${day}(${dayOfWeek})`
        : `${month}/${day}(${dayOfWeek})`;
    }),
  };
});

describe('useEventTableData', () => {
  beforeEach(() => {
    vi.mocked(useLiveEvents).mockReturnValue({
      allEvents: mockEvents,
      idols: [],
      members: [],
      loading: false,
      error: null,
    });
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-15T00:00:00Z')); // Set current date to 2025-07-15
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('filters upcoming events correctly', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    expect(result.current.eventTableData).toHaveLength(3); // 未来のテストイベント1, Event 2, Event 3
    expect(result.current.eventTableData[0].content).toBe(mockEvents[0].content);
    expect(result.current.eventTableData[1].content).toBe(mockEvents[1].content);
    expect(result.current.eventTableData[2].content).toBe(mockEvents[2].content);
  });

  it('filters past events correctly', () => {
    const { result } = renderHook(() => useEventTableData('past', []));
    expect(result.current.eventTableData).toHaveLength(2); // 過去のテストイベント1, 過去のテストイベント2
    expect(result.current.eventTableData[0].content).toBe(mockEvents[3].content);
    expect(result.current.eventTableData[1].content).toBe(mockEvents[4].content);
  });

  it('filters events by selected idols correctly', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', ['idol1']));
    expect(result.current.eventTableData).toHaveLength(2); // 未来のテストイベント1, Event 3
    expect(result.current.eventTableData[0].content).toBe(mockEvents[0].content);
    expect(result.current.eventTableData[1].content).toBe(mockEvents[2].content);
  });

  it('applies correct rowspan and isFirstOfDay for grouped events', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    const tableData = result.current.eventTableData;

    // 未来のテストイベント1 (first of day)
    expect(tableData[0].content).toBe(mockEvents[0].content);
    expect(tableData[0].isFirstOfDay).toBe(true);
    expect(tableData[0].rowspan).toBe(2); // 未来のテストイベント1 and Event 2 are on the same day

    // Event 2 (not first of day)
    expect(tableData[1].content).toBe(mockEvents[1].content);
    expect(tableData[1].isFirstOfDay).toBe(false);
    expect(tableData[1].rowspan).toBeUndefined();

    // Event 3 (first of new day)
    expect(tableData[2].content).toBe(mockEvents[2].content);
    expect(tableData[2].isFirstOfDay).toBe(true);
    expect(tableData[2].rowspan).toBe(1);
  });

  it('enriches events with idol colors', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    const tableData = result.current.eventTableData;

    // mockProcessedIdols の定義順序と mockProcessedEvents の idol の id を考慮
    expect(tableData[0].colors).toEqual(mockEvents[0].idol.colors); // 未来のテストイベント1 (Idol A)
    expect(tableData[1].colors).toEqual(mockEvents[1].idol.colors); // Event 2 (Idol B)
    expect(tableData[2].colors).toEqual(mockEvents[2].idol.colors); // Event 3 (Idol A)
  });

  it('sorts past events in descending order by date', () => {
    const { result } = renderHook(() => useEventTableData('past', []));
    const tableData = result.current.eventTableData;

    // 過去のテストイベント1 が最初の過去イベント (日付が新しい)
    expect(tableData[0].content).toBe(mockEvents[3].content);
    expect(tableData[1].content).toBe(mockEvents[4].content);
  });

  it('sets isToday correctly for events on the current date', () => {
    // 未来のテストイベント1 と Event 2 は 2025-07-15
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    const tableData = result.current.eventTableData;

    expect(tableData[0].content).toBe(mockEvents[0].content);
    expect(tableData[0].isToday).toBe(true);

    expect(tableData[1].content).toBe(mockEvents[1].content);
    expect(tableData[1].isToday).toBe(true);

    expect(tableData[2].content).toBe(mockEvents[2].content); // Event 3 は 2025-07-16
    expect(tableData[2].isToday).toBe(false);
  });
});
