import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEventTableData } from '../useEventTableData';
import { useLiveEvents } from '../useLiveEvents';

// Mock useLiveEvents hook
vi.mock('../useLiveEvents');

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
  const mockAllEvents = [
    {
      id: 'idol1',
      name: 'Event 1',
      date: new Date('2025-07-15T10:00:00Z'),
      content: 'Event 1',
      url: 'url1',
      short_name: 'Idol A',
      link: 'link1',
      image: 'image1',
      formatted_date: '',
    },
    {
      id: 'idol2',
      name: 'Event 2',
      date: new Date('2025-07-15T12:00:00Z'),
      content: 'Event 2',
      url: 'url2',
      short_name: 'Idol B',
      link: 'link2',
      image: 'image2',
      formatted_date: '',
    },
    {
      id: 'idol1',
      name: 'Event 3',
      date: new Date('2025-07-16T10:00:00Z'),
      content: 'Event 3',
      url: 'url3',
      short_name: 'Idol A',
      link: 'link3',
      image: 'image3',
      formatted_date: '',
    },
    {
      id: 'idol3',
      name: 'Event 4',
      date: new Date('2025-07-14T10:00:00Z'), // Past event
      content: 'Event 4',
      url: 'url4',
      short_name: 'Idol C',
      link: 'link4',
      image: 'image4',
      formatted_date: '',
    },
  ];

  const mockIdols = [
    {
      id: 'idol1',
      name: 'Idol A',
      short_name: 'Idol A',
      colors: { background: '#FF0000', foreground: '#FFFFFF', text: '#000000' },
    },
    {
      id: 'idol2',
      name: 'Idol B',
      short_name: 'Idol B',
      colors: { background: '#00FF00', foreground: '#000000', text: '#000000' },
    },
    {
      id: 'idol3',
      name: 'Idol C',
      short_name: 'Idol C',
      colors: { background: '#0000FF', foreground: '#FFFFFF', text: '#000000' },
    },
  ];

  beforeEach(() => {
    vi.mocked(useLiveEvents).mockReturnValue({
      allEvents: mockAllEvents,
      idols: mockIdols,
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
    expect(result.current.eventTableData).toHaveLength(3); // Event 1, 2, 3
    expect(result.current.eventTableData[0].content).toBe('Event 1');
    expect(result.current.eventTableData[1].content).toBe('Event 2');
    expect(result.current.eventTableData[2].content).toBe('Event 3');
  });

  it('filters past events correctly', () => {
    const { result } = renderHook(() => useEventTableData('past', []));
    expect(result.current.eventTableData).toHaveLength(1); // Event 4
    expect(result.current.eventTableData[0].content).toBe('Event 4');
  });

  it('filters events by selected idols correctly', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', ['idol1']));
    expect(result.current.eventTableData).toHaveLength(2); // Event 1, 3
    expect(result.current.eventTableData[0].content).toBe('Event 1');
    expect(result.current.eventTableData[1].content).toBe('Event 3');
  });

  it('applies correct rowspan and isFirstOfDay for grouped events', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    const tableData = result.current.eventTableData;

    // Event 1 (first of day)
    expect(tableData[0].content).toBe('Event 1');
    expect(tableData[0].isFirstOfDay).toBe(true);
    expect(tableData[0].rowspan).toBe(2); // Event 1 and Event 2 are on the same day

    // Event 2 (not first of day)
    expect(tableData[1].content).toBe('Event 2');
    expect(tableData[1].isFirstOfDay).toBe(false);
    expect(tableData[1].rowspan).toBeUndefined();

    // Event 3 (first of new day)
    expect(tableData[2].content).toBe('Event 3');
    expect(tableData[2].isFirstOfDay).toBe(true);
    expect(tableData[2].rowspan).toBe(1);
  });

  it('enriches events with idol colors', () => {
    const { result } = renderHook(() => useEventTableData('upcoming', []));
    const tableData = result.current.eventTableData;

    expect(tableData[0].colors).toEqual(mockIdols[0].colors); // Idol A
    expect(tableData[1].colors).toEqual(mockIdols[1].colors); // Idol B
    expect(tableData[2].colors).toEqual(mockIdols[0].colors); // Idol A
  });

  it('sorts past events in descending order by date', () => {
    const { result } = renderHook(() => useEventTableData('past', []));
    const tableData = result.current.eventTableData;

    // Only Event 4 is a past event in mockAllEvents
    expect(tableData[0].content).toBe('Event 4');
  });
});
