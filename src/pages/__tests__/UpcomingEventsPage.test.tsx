import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { UpcomingEventsPage } from '../UpcomingEventsPage';

import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';
import type { Idol, TableEvent } from '@/types';

vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/hooks/useSelectedIdols');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);
const mockUseSelectedIdols = vi.mocked(useSelectedIdols);

const mockEventData: TableEvent[] = [
  { id: 'event1', date: '2099-01-15', content: '未来のテストイベント1', short_name: 'アイカツ！' },
];

const mockIdols: Idol[] = [
  {
    id: 'aikatsu',
    name: 'アイカツ！',
    short_name: 'アイカツ！',
    colors: { background: '#FF6347', foreground: '#FFFFFF', text: '#FF6347' },
  },
  {
    id: 'pripara',
    name: 'プリパラ',
    short_name: 'プリパラ',
    colors: { background: '#8A2BE2', foreground: '#FFFFFF', text: '#8A2BE2' },
  },
];
const allIdolIds = mockIdols.map((idol) => idol.id);

describe('UpcomingEventsPage', () => {
  const user = userEvent.setup();
  let mockSetSelectedIdols: Mock;

  beforeEach(() => {
    vi.resetAllMocks();
    mockSetSelectedIdols = vi.fn();

    // デフォルトのモックを設定
    mockUseLiveEvents.mockReturnValue({
      loading: false,
      error: null,
      idols: mockIdols,
      allEvents: [],
      updatedAt: undefined,
    });
    mockUseEventTableData.mockReturnValue({ eventTableData: mockEventData });
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
  });

  const renderComponent = () => {
    return render(
      <LiveEventsContext.Provider
        value={{
          loading: false,
          error: null,
          idols: mockIdols,
          allEvents: [],
          updatedAt: undefined,
        }}
      >
        <UpcomingEventsPage />
      </LiveEventsContext.Provider>
    );
  };

  it('ローディング中にスケルトンコンポーネントが表示される', () => {
    mockUseLiveEvents.mockReturnValue({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
      updatedAt: undefined,
    });
    renderComponent();
    expect(screen.getByText('日付')).toBeInTheDocument();
    expect(screen.getByText('イベント内容')).toBeInTheDocument();
  });

  it('エラー発生時にエラーメッセージが表示される', () => {
    mockUseLiveEvents.mockReturnValue({
      loading: false,
      error: 'Test Error',
      idols: [],
      allEvents: [],
      updatedAt: undefined,
    });
    renderComponent();
    expect(screen.getByText('エラー: Test Error')).toBeInTheDocument();
  });

  it('データがある場合にイベントテーブルが表示される', () => {
    renderComponent();
    expect(screen.getByText('未来のテストイベント1')).toBeInTheDocument();
  });

  it('データがない場合に「今後のライブ予定はありません。」と表示される', () => {
    mockUseEventTableData.mockReturnValue({ eventTableData: [] });
    renderComponent();
    expect(screen.getByText('今後のライブ予定はありません。')).toBeInTheDocument();
  });

  it('IdolFilterでアイドルを選択すると、setSelectedIdolsが呼ばれる', async () => {
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
    renderComponent();

    // 「アイカツ！」をクリックして選択解除
    const aikatsuButton = screen.getByRole('button', { name: 'アイカツ！' });
    await user.click(aikatsuButton);

    expect(mockSetSelectedIdols).toHaveBeenCalledWith(['pripara']);
  });
});
