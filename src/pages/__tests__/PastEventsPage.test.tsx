import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useSelectedIdols } from '@/hooks/useSelectedIdols';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import type { Idol, TableEvent } from '@/types';
import { PastEventsPage } from '../PastEventsPage';

vi.mock('@/providers/LiveEventsProvider');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/hooks/useSelectedIdols');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);
const mockUseSelectedIdols = vi.mocked(useSelectedIdols);

const mockEventData: TableEvent[] = [
  {
    id: 'event1',
    idolId: 'aikatsu',
    date: '2024-01-15',
    content: 'テストイベント1',
    short_name: 'アイカツ！',
  },
  {
    id: 'event2',
    idolId: 'pripara',
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
const allIdolIds = mockIdols.map((idol) => idol.id);

describe('PastEventsPage', () => {
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
    return render(<PastEventsPage />);
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
    // useSelectedIdolsが全選択を返すので、useEventTableDataは全IDで呼ばれる
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
    renderComponent();
    expect(screen.getByText('テストイベント1')).toBeInTheDocument();
    // PeriodFilterの挙動でフィルタされる
    expect(screen.queryByText('テストイベント2')).not.toBeInTheDocument();
  });

  it('PeriodFilterで年を選択すると、イベントがその年でフィルタリングされる', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('テストイベント1')).toBeInTheDocument();
    });

    const yearSelect = screen.getByRole('combobox');
    await user.click(yearSelect);
    const option2023 = await screen.findByRole('option', { name: '2023年' });
    await user.click(option2023);

    await waitFor(() => {
      expect(screen.queryByText('テストイベント1')).not.toBeInTheDocument();
      expect(screen.getByText('テストイベント2')).toBeInTheDocument();
    });
  });

  it('IdolFilterでアイドルを選択すると、setSelectedIdolsが呼ばれる', async () => {
    // 初期状態は全選択
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
    renderComponent();

    // 「アイカツ！」をクリックして選択解除
    const aikatsuButton = screen.getByRole('button', { name: 'アイカツ！' });
    await user.click(aikatsuButton);

    // setSelectedIdolsが 'pripara' のみを含む配列で呼ばれることを確認
    expect(mockSetSelectedIdols).toHaveBeenCalledWith(['pripara']);
  });
});
