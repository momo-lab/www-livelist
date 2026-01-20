import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';
import type { Idol } from '@/types';

vi.mock('@/hooks/useLiveEvents');

const mockUseLiveEvents = vi.mocked(useLiveEvents);

const mockIdols: Idol[] = [
  {
    id: 'lumi7',
    name: 'LUMiNATiO',
    short_name: 'lumi7',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
  {
    id: 'mofcro',
    name: 'もふくろちゃん',
    short_name: 'mofcro',
    colors: { background: '#fff', foreground: '#000', text: '#000' },
  },
];

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
    expect(result.current[0]).toEqual(['lumi7', 'mofcro']);
  });

  it('should return selected idols from localStorage', () => {
    localStorage.setItem('selectedIdols', JSON.stringify(['mofcro']));
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: false,
      error: null,
      allEvents: [],
      members: [],
      updatedAt: undefined,
    });
    const { result } = renderHook(() => useSelectedIdols());
    expect(result.current[0]).toEqual(['mofcro']);
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
      setSelectedIdols(['lumi7']);
    });

    expect(result.current[0]).toEqual(['lumi7']);
    expect(localStorage.getItem('selectedIdols')).toBe(JSON.stringify(['lumi7']));
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
