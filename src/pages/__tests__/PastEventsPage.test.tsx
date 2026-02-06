import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { mockIdols, mockEvents } from '@/__mocks__';
import { useEventTableData } from '@/hooks/app/useEventTableData';
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { HeaderSlotsProvider } from '@/providers/HeaderSlotsProvider';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import { PastEventsPage } from '../PastEventsPage';

vi.mock('@/providers/LiveEventsProvider');
vi.mock('@/hooks/app/useEventTableData');
vi.mock('@/hooks/app/useSelectedIdols');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);
const mockUseSelectedIdols = vi.mocked(useSelectedIdols);

const allIdolIds = mockIdols.map((idol) => idol.id);

describe('PastEventsPage', () => {
  let mockSetSelectedIdols: Mock;

  beforeEach(() => {
    vi.resetAllMocks();
    mockSetSelectedIdols = vi.fn();

    // デフォルトのモックを設定
    mockUseLiveEvents.mockReturnValue({
      loading: false,
      error: null,
      idols: mockIdols,
      allEvents: mockEvents,
      members: [],
      updatedAt: undefined,
    });
    // 現在の日付を仮定して、過去のイベントのみをフィルタリング
    // useEventTableDataの内部ロジックを模倣してイベントをフィルタリング
    const pastEvents = mockEvents.filter(
      (event) => new Date(event.date) < new Date('2025-07-15T00:00:00Z')
    );
    mockUseEventTableData.mockReturnValue({ eventTableData: pastEvents });
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-07-15T00:00:00Z')); // Set current date for filtering logic
  });

  const renderComponent = () => {
    return render(
      <HeaderSlotsProvider>
        <PastEventsPage />
      </HeaderSlotsProvider>
    );
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
    // mockEventsの過去イベントでフィルターされた最初のイベントを期待
    expect(screen.getByText(mockEvents[3].content)).toBeInTheDocument();
    expect(screen.getByText(mockEvents[4].content)).toBeInTheDocument();
  });

  it('PeriodFilterで年を選択すると、イベントがその年でフィルタリングされる', async () => {
    // TODO: 未実装
  });

  it('IdolFilterでアイドルを選択すると、setSelectedIdolsが呼ばれる', async () => {
    // TODO: 未実装
  });
});
