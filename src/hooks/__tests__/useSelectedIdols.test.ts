import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';
import type { Idol } from '@/types';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

// useLiveEventsとuseLocalStorageをモック
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useLocalStorage');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseLocalStorage = vi.mocked(useLocalStorage);

const mockIdols: Idol[] = [
  {
    id: 'aikatsu',
    name: 'アイカツ！',
    short_name: 'アイカツ！',
    colors: { background: '', foreground: '', text: '' },
  },
  {
    id: 'pripara',
    name: 'プリパラ',
    short_name: 'プリパラ',
    colors: { background: '', foreground: '', text: '' },
  },
];
const allIdolIds = mockIdols.map((idol) => idol.id);

describe('useSelectedIdols', () => {
  let mockSetSelectedIdols: Mock;

  beforeEach(() => {
    mockSetSelectedIdols = vi.fn();
    // デフォルトのモックを設定
    mockUseLiveEvents.mockReturnValue({
      idols: [],
      loading: true,
      error: null,
      allEvents: [],
      updatedAt: undefined,
    });
    mockUseLocalStorage.mockReturnValue([[], mockSetSelectedIdols]);
    vi.spyOn(Storage.prototype, 'getItem');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('初回アクセス時（localStorageが空）に、アイドルのロードが完了したら全選択で初期化する', async () => {
    // localStorageが空の状態をシミュレート
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    const { rerender } = renderHook(() => useSelectedIdols());

    // 初期状態ではまだ呼ばれない
    expect(mockSetSelectedIdols).not.toHaveBeenCalled();

    // アイドルデータがロードされた状態をシミュレート
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: false,
      error: null,
      allEvents: [],
      updatedAt: undefined,
    });

    rerender({}); // 再レンダリングをトリガー

    await waitFor(() => {
      expect(mockSetSelectedIdols).toHaveBeenCalledWith(allIdolIds);
    });
  });

  it('再アクセス時（localStorageに値あり）は、初期化処理を行わない', async () => {
    // localStorageに値が存在する状態をシミュレート
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(['aikatsu']));

    const { rerender } = renderHook(() => useSelectedIdols());

    // アイドルデータがロードされた状態をシミュレート
    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: false,
      error: null,
      allEvents: [],
      updatedAt: undefined,
    });

    rerender({}); // 再レンダリングをトリガー

    // 少し待っても何も起こらないことを確認
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockSetSelectedIdols).not.toHaveBeenCalled();
  });

  it('ローディング中でも初期化処理は行われない', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    mockUseLiveEvents.mockReturnValue({
      idols: mockIdols,
      loading: true, // ローディング中
      error: null,
      allEvents: [],
      updatedAt: undefined,
    });

    renderHook(() => useSelectedIdols());

    expect(mockSetSelectedIdols).not.toHaveBeenCalled();
  });

  it('アイドルデータが空の場合は初期化処理は行われない', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    mockUseLiveEvents.mockReturnValue({
      idols: [], // アイドルデータが空
      loading: false,
      error: null,
      allEvents: [],
      updatedAt: undefined,
    });

    renderHook(() => useSelectedIdols());

    expect(mockSetSelectedIdols).not.toHaveBeenCalled();
  });
});
