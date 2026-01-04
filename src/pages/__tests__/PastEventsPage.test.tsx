import { LiveEventsContext } from '@/contexts/LiveEventsContext';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PastEventsPage } from '../PastEventsPage';

import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import type { Idol, TableEvent } from '@/types';

// データを提供するフックのみをモック
// Note: useLiveEvents は Context を経由するため厳密には不要だが、
//       IdolFilter のような子コンポーネントが直接使っているためモックを残す
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);

const mockEventData: TableEvent[] = [
  {
    id: 'event1',
    date: '2024-01-15',
    content: 'テストイベント1',
    short_name: 'アイカツ！',
  },
  {
    id: 'event2',
    date: '2023-12-10',
    content: 'テストイベント2',
    short_name: 'プリパラ',
  },
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

describe('PastEventsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();

    mockUseEventTableData.mockReturnValue({
      eventTableData: mockEventData,
    });
  });

  // コンテキストの値を引数で受け取り、Providerでラップしてレンダリングするヘルパー
  const renderComponent = (
    contextValue: React.ContextType<typeof LiveEventsContext> = {
      loading: false,
      error: null,
      idols: mockIdols,
      allEvents: [],
      updatedAt: undefined,
    }
  ) => {
    // 子コンポーネント(IdolFilter)が使うuseLiveEventsも同じ値でモックする
    mockUseLiveEvents.mockReturnValue(contextValue);

    return render(
      <LiveEventsContext.Provider value={contextValue}>
        <PastEventsPage />
      </LiveEventsContext.Provider>
    );
  };

  it('ローディング中にスケルトンコンポーネントが表示される', () => {
    renderComponent({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
      updatedAt: undefined,
    });

    expect(screen.getByText('日付')).toBeInTheDocument();
    expect(screen.getByText('イベント内容')).toBeInTheDocument();
  });

  it('エラー発生時にエラーメッセージが表示される', () => {
    const errorMessage = 'データの取得に失敗しました';
    renderComponent({
      loading: false,
      error: errorMessage,
      idols: [],
      allEvents: [],
      updatedAt: undefined,
    });

    expect(screen.getByText(`エラー: ${errorMessage}`)).toBeInTheDocument();
  });

  it('データがある場合にイベントテーブルが表示され、自動で最新年でフィルタされる', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('テストイベント1')).toBeInTheDocument();
    });

    expect(screen.queryByText('テストイベント2')).not.toBeInTheDocument();
    expect(screen.queryByText('過去のライブ履歴はありません。')).not.toBeInTheDocument();
  });

  it('データがない場合に「過去のライブ履歴はありません。」と表示される', () => {
    mockUseEventTableData.mockReturnValue({
      eventTableData: [],
    });
    renderComponent();

    expect(screen.getByText('過去のライブ履歴はありません。')).toBeInTheDocument();
    expect(screen.queryByText('テストイベント1')).not.toBeInTheDocument();
  });

  it('PeriodFilterで年を選択すると、イベントがその年でフィルタリングされる', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('テストイベント1')).toBeInTheDocument();
    });
    expect(screen.queryByText('テストイベント2')).not.toBeInTheDocument();

    const yearSelect = screen.getByRole('combobox');
    await user.click(yearSelect);

    const option2023 = await screen.findByRole('option', { name: '2023年' });
    await user.click(option2023);

    await waitFor(() => {
      expect(screen.queryByText('テストイベント1')).not.toBeInTheDocument();
      expect(screen.getByText('テストイベント2')).toBeInTheDocument();
    });
  });

  it('IdolFilterでアイドルの選択・解除ができる', async () => {
    renderComponent();

    await waitFor(() => {
      expect(mockUseEventTableData).toHaveBeenCalledWith('past', []);
    });

    const idolButton = screen.getByRole('button', { name: 'アイカツ！' });
    await user.click(idolButton);

    await waitFor(() => {
      expect(mockUseEventTableData).toHaveBeenCalledWith('past', ['aikatsu']);
    });

    await user.click(idolButton);
    await waitFor(() => {
      const allIdolIds = mockIdols.map((idol) => idol.id);
      expect(mockUseEventTableData).toHaveBeenCalledWith('past', allIdolIds);
    });
  });
});
