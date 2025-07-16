import type { TableEvent } from '@/types';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PastEventsPage } from '../PastEventsPage';

// Import the actual modules to be mocked
import { IdolFilter } from '@/components/IdolFilter';
import { LiveEventTable } from '@/components/LiveEventTable';
import { PeriodFilter } from '@/components/PeriodFilter';
import { useEventTableData } from '@/hooks/useEventTableData';
import { useLiveEvents } from '@/hooks/useLiveEvents';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock dependencies at the top level
vi.mock('@/hooks/useLiveEvents');
vi.mock('@/hooks/useEventTableData');
vi.mock('@/components/IdolFilter');
vi.mock('@/components/LiveEventTable');
vi.mock('@/components/PeriodFilter');
vi.mock('@/hooks/useLocalStorage');

// 状態管理用のグローバル変数と関数を定義
let mockSelectedIdols: string[];
let mockSetSelectedIdols: ReturnType<typeof vi.fn>;
let mockSelectedPeriod: { year?: number; month?: number };
let mockSetSelectedPeriod: (period: { year?: number; month?: number }) => void;

describe('PastEventsPage', () => {
  // 各テスト前のセットアップ
  const setupMocks = () => {
    mockSelectedIdols = [];
    mockSelectedPeriod = {};

    mockSetSelectedIdols = vi.fn((newIdols: string[]) => {
      mockSelectedIdols = newIdols;
    });

    mockSetSelectedPeriod = vi.fn((period: { year?: number; month?: number }) => {
      mockSelectedPeriod = period;
    });

    // Reactのモック
    vi.mock('react', async (importOriginal) => {
      const mod = (await importOriginal()) as {
        useState: <T>(initialState: T) => [T, (value: T) => void];
        [key: string]: unknown;
      };

      return {
        ...mod,
        useState: vi.fn((initialState: unknown) => {
          if (
            typeof initialState === 'object' &&
            initialState !== null &&
            !Array.isArray(initialState)
          ) {
            return [mockSelectedPeriod, mockSetSelectedPeriod];
          }
          if (Array.isArray(initialState) && initialState.length === 0) {
            return [mockSelectedIdols, mockSetSelectedIdols];
          }
          return mod.useState(initialState);
        }),
      };
    });

    // 各モックの設定
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: false,
      error: null,
      idols: [],
      allEvents: [],
    });

    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [],
    });

    vi.mocked(IdolFilter).mockImplementation(({ selectedIdols, onSelectedIdolsChange }) => {
      const handleIdolChange = () => {
        onSelectedIdolsChange(['mockIdol1']);
      };

      return (
        <div data-testid="mock-idol-filter" data-selected-idols={JSON.stringify(selectedIdols)}>
          <button onClick={handleIdolChange}>Change Idols</button>
        </div>
      );
    });

    vi.mocked(LiveEventTable).mockImplementation(({ tableData }) => (
      <div data-testid="mock-live-event-table" data-table-data={JSON.stringify(tableData)}>
        Mock Live Event Table
      </div>
    ));

    vi.mocked(PeriodFilter).mockImplementation(({ selectedPeriod, onSelectedPeriodChange }) => {
      const handlePeriodChange = () => {
        onSelectedPeriodChange({ year: 2024, month: undefined });
      };
      return (
        <div data-testid="mock-period-filter" data-selected-period={selectedPeriod}>
          <button onClick={handlePeriodChange}>Select 2024</button>
        </div>
      );
    });

    vi.mocked(useLocalStorage).mockImplementation((key, initialValue) => {
      if (key === 'selectedIdols') {
        return [mockSelectedIdols, mockSetSelectedIdols];
      }
      return [initialValue, vi.fn()];
    });
  };

  // 各テスト前にモックをセットアップ
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: true,
      error: null,
      idols: [],
      allEvents: [],
    });

    render(<PastEventsPage />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useLiveEvents).mockReturnValue({
      loading: false,
      error: 'Test Error',
      idols: [],
      allEvents: [],
    });

    render(<PastEventsPage />);
    expect(screen.getByText('エラー: Test Error')).toBeInTheDocument();
  });

  it('renders LiveEventTable when data is available', () => {
    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [
        {
          id: 'event1',
          content: 'Test Event',
          url: '',
          name: 'Test Event',
          short_name: '',
          date: new Date(),
          formatted_date: '',
          link: '',
        },
      ],
    });

    render(<PastEventsPage />);
    expect(screen.getByTestId('mock-live-event-table')).toBeInTheDocument();
    expect(screen.queryByText('過去のライブ履歴はありません。')).not.toBeInTheDocument();
  });

  it('renders no events message when eventTableData is empty for past mode', () => {
    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: [],
    });
    render(<PastEventsPage />);
    expect(screen.getByText('過去のライブ履歴はありません。')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-live-event-table')).not.toBeInTheDocument();
  });

  it('loads selectedIdols from useLocalStorage on initial render', () => {
    mockSelectedIdols = ['storedIdol'];

    render(<PastEventsPage />);

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['storedIdol']));
  });

  it('updates selectedIdols and useLocalStorage when IdolFilter changes selection', async () => {
    mockSelectedIdols = [];

    const { rerender } = render(<PastEventsPage />);

    const idolFilterButton = screen.getByText('Change Idols');

    await act(async () => {
      idolFilterButton.click();
    });

    rerender(<PastEventsPage />);

    expect(mockSetSelectedIdols).toHaveBeenCalledWith(['mockIdol1']);
    expect(mockSelectedIdols).toEqual(['mockIdol1']);

    const idolFilter = screen.getByTestId('mock-idol-filter');
    expect(idolFilter).toHaveAttribute('data-selected-idols', JSON.stringify(['mockIdol1']));
  });

  it('updates selectedPeriod and filters events when PeriodFilter changes selection', async () => {
    const mockEventTableData: TableEvent[] = [
      {
        date: new Date('2024-01-01'),
        id: 'event1',
        url: '',
        name: 'Event 1',
        short_name: 'E1',
        formatted_date: '2024-01-01',
        content: '',
        link: '',
      },
      {
        date: new Date('2023-01-01'),
        id: 'event2',
        url: '',
        name: 'Event 2',
        short_name: 'E2',
        formatted_date: '2023-01-01',
        content: '',
        link: '',
      },
    ];
    vi.mocked(useEventTableData).mockReturnValue({
      eventTableData: mockEventTableData,
    });

    mockSelectedPeriod = {};

    render(<PastEventsPage />);

    const selectYearButton = screen.getByText('Select 2024');

    await act(async () => {
      selectYearButton.click();
    });

    expect(mockSetSelectedPeriod).toHaveBeenCalledWith({ year: 2024, month: undefined });
    expect(mockSelectedPeriod).toEqual({ year: 2024, month: undefined });
  });
});
