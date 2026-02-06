import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useEventTableData } from '@/hooks/app/useEventTableData';
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import type { Idol, TableEvent } from '@/types';
import { UpcomingEventsPage } from '../UpcomingEventsPage';

vi.mock('@/providers/LiveEventsProvider');
vi.mock('@/hooks/app/useEventTableData');
vi.mock('@/hooks/app/useSelectedIdols');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);
const mockUseSelectedIdols = vi.mocked(useSelectedIdols);

const mockIdols: Idol[] = [
  {
    id: 'aikatsu',
    name: 'アイカツ！',
    short_name: 'アイカツ！',
    litlink_id: 'aikatsu',
    colors: { background: '#FF6347', foreground: '#FFFFFF', text: '#FF6347' },
  },
  {
    id: 'pripara',
    name: 'プリパラ',
    short_name: 'プリパラ',
    litlink_id: 'pripara',
    colors: { background: '#8A2BE2', foreground: '#FFFFFF', text: '#8A2BE2' },
  },
];
const allIdolIds = mockIdols.map((idol) => idol.id);

const mockEventData: TableEvent[] = [
  {
    id: 'event1',
    idol: mockIdols[0],
    date: '2099-01-15',
    content: '未来のテストイベント1',
    short_name: 'アイカツ！',
  },
];

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
      members: [],
      updatedAt: undefined,
    });
    mockUseEventTableData.mockReturnValue({ eventTableData: mockEventData });
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
  });

  const renderComponent = () => {
    return render(<UpcomingEventsPage />);
  };

  it('ローディング中にスケルトンコンポーネントが表示される', () => {
    mockUseLiveEvents.mockReturnValue({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
      members: [],
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
      members: [],
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
