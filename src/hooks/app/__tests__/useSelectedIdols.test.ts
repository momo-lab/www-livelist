import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockIdols } from '@/__mocks__'; // mockProcessedIdols をインポート
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { useLiveEvents } from '@/providers/LiveEventsProvider';

vi.mock('@/providers/LiveEventsProvider');

const mockUseLiveEvents = vi.mocked(useLiveEvents);

describe('useSelectedIdols', () => {
  beforeEach(() => {
    mockUseLiveEvents.mockReturnValue({
      idols: [],
      loading: true,
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should return all idol IDs if localStorage is empty', () => {
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: false,
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
    const { result } = renderHook(() => useSelectedIdols());
    expect(result.current[0]).toEqual([
      mockIdols[0].id,
      mockIdols[1].id,
      // mockIdols[2]はlitlink_idがないので追加されない
      mockIdols[3].id,
      mockIdols[4].id,
    ]);
  });

  it('should return selected idols from localStorage', () => {
    localStorage.setItem('selectedIdols', JSON.stringify([mockIdols[0].id]));
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: false,
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
    const { result } = renderHook(() => useSelectedIdols());
    expect(result.current[0]).toEqual([mockIdols[0].id]);
  });

  it('should update selected idols and localStorage', () => {
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: true, // loading中でも動作するはず
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
    const { result } = renderHook(() => useSelectedIdols());
    const [, setSelectedIdols] = result.current;

    act(() => {
      setSelectedIdols([mockIdols[0].id]);
    });

    expect(result.current[0]).toEqual([mockIdols[0].id]);
    expect(localStorage.getItem('selectedIdols')).toBe(JSON.stringify([mockIdols[0].id]));
  });

  it('should return an empty array if there are no idols', () => {
    mockUseLiveEvents.mockReturnValue({
      idols: [], // アイドルデータが空
      loading: false,
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
    const { result } = renderHook(() => useSelectedIdols());
    expect(result.current[0]).toEqual([]);
  });
});
