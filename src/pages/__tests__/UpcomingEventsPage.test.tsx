import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { mockIdols, mockEvents } from '@/__mocks__';
import { useEventTableData } from '@/hooks/app/useEventTableData';
import { useSelectedIdols } from '@/hooks/app/useSelectedIdols';
import { HeaderSlotsProvider } from '@/providers/HeaderSlotsProvider';
import { useLiveEvents } from '@/providers/LiveEventsProvider';
import { UpcomingEventsPage } from '../UpcomingEventsPage';

vi.mock('@/providers/LiveEventsProvider');
vi.mock('@/providers/HeaderTitleProvider');
vi.mock('@/hooks/app/useEventTableData');
vi.mock('@/hooks/app/useSelectedIdols');

const mockUseLiveEvents = vi.mocked(useLiveEvents);
const mockUseEventTableData = vi.mocked(useEventTableData);
const mockUseSelectedIdols = vi.mocked(useSelectedIdols);

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
      allEvents: mockEvents,
      members: [],
      updatedAt: undefined,
    });
    mockUseEventTableData.mockReturnValue({ eventTableData: mockEvents });
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
  });

  const renderComponent = () => {
    return render(
      <HeaderSlotsProvider>
        <UpcomingEventsPage />
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
    renderComponent();
    expect(screen.getByText(mockEvents[0].content)).toBeInTheDocument();
  });

  it('データがない場合に「今後のライブ予定はありません。」と表示される', () => {
    mockUseEventTableData.mockReturnValue({ eventTableData: [] });
    renderComponent();
    expect(screen.getByText('今後のライブ予定はありません。')).toBeInTheDocument();
  });

  it('IdolFilterでアイドルを選択すると、setSelectedIdolsが呼ばれる', async () => {
    mockUseSelectedIdols.mockReturnValue([allIdolIds, mockSetSelectedIdols]);
    renderComponent();

    // mockIdols の最初のアイドル名に合わせて修正
    const idolButton = screen.getByRole('button', { name: mockIdols[0].name });
    await user.click(idolButton);

    // mockIdols の最初のアイドルが除外されることを想定
    expect(mockSetSelectedIdols).toHaveBeenCalledWith(allIdolIds.slice(1));
  });
});
